// backend/controllers/setuController.js
const fetch = require("node-fetch");
const fetchWithSetu = require('../setuFetch');
const db = require("../db"); // expect db.pool to exist

const SETU_BASE = process.env.SETU_BASE;
const PRODUCT_INSTANCE_ID = process.env.SETU_PRODUCT_INSTANCE_ID;
const AUTO_FETCH = process.env.SETU_AUTO_FETCH === "true";

/**
 * createConsent
 * - Uses a wide default dataRange (10 years back) so future data-sessions are not out of range
 * - Honors durationMonths if provided (will set consentDuration)
 */
async function createConsent(req, res) {
  try {
    const {durationMonths, purposeCode, vua, purposeText, fetchType } = req.body;
     const userId = req.user.id; // get from verified token

    if (!userId) {
      return res.status(400).json({ error: "userId not authenticated" });
    }

    // -------------------------------
    // consentDuration (months)
    const durationValue = durationMonths ? Number(durationMonths) : 12;
    if (Number.isNaN(durationValue) || durationValue <= 0) {
      return res.status(400).json({ error: "durationMonths must be a positive number" });
    }

    // -------------------------------
    // fetchType
    const finalFetchType =
      fetchType && typeof fetchType === "string" && fetchType.toUpperCase() === "PERIODIC"
        ? "PERIODIC"
        : "ONETIME";

    // default "from" window (you can choose 6 months back or other)
    const today = new Date();
    const defaultFromDate = new Date(today);
    defaultFromDate.setMonth(defaultFromDate.getMonth() - 6); // keep 6 months historical by default

    // IMPORTANT: set consent 'to' to consent expiry (now + duration months)
    // This allows creating data sessions in future up to consent expiry.
    const expiryDate = new Date(today);
    expiryDate.setMonth(expiryDate.getMonth() + durationValue);

    // final dataRange sent to Setu:
    const dataRange = {
      from: defaultFromDate.toISOString(),
      to: expiryDate.toISOString(),
    };

    const purposeObj = {
      code: String(purposeCode || "102"),
      text: purposeText || "Customer spending analysis",
      refUri: "https://api.rebit.org.in/aa/purpose/102.xml",
      category: { type: "BUDGET" },
    };

    const setuBody = {
      consentDuration: { unit: "MONTH", value: String(durationValue) },
      dataRange,
      consentTypes: ["PROFILE", "TRANSACTIONS", "SUMMARY"],
      fetchType: finalFetchType,
      ...(finalFetchType === "PERIODIC" ? { frequency: { unit: "MONTH", value: 1 } } : {}),
      purpose: purposeObj,
      ...(vua ? { vua } : {}),
      context: [],
    };

    const response = await fetchWithSetu(`${SETU_BASE}/consents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-product-instance-id": PRODUCT_INSTANCE_ID,
      },
      body: JSON.stringify(setuBody),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      const txt = await response.text().catch(() => "<no-body>");
      return res.status(502).json({ error: "Invalid response from Setu", body: txt });
    }

    if (!response.ok) {
      console.error("Setu create consent failed:", response.status, data);
      return res.status(502).json({ error: "Setu error", status: response.status, body: data });
    }

    // Save in DB (raw_response as JSON)
    const pool = db.pool;
    const client = await pool.connect();
    try {
      const consentId = data?.id || data?.consentId || data?.consent?.id;
      await client.query(
        `INSERT INTO consents (consent_id, user_id, status, raw_response, vua, purpose, consent_duration, consent_date_range, auto_fetch)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (consent_id) DO UPDATE SET raw_response = $4, status = EXCLUDED.status`,
        [
          consentId,
          userId,
          data?.status || "PENDING",
          JSON.stringify(data),
          vua || null,
          purposeObj.text,
          JSON.stringify(setuBody.consentDuration),
          JSON.stringify(setuBody.dataRange),
          finalFetchType === "PERIODIC",
        ]
      );
    } finally {
      client.release();
    }

    const redirectUrl = data?.url || data?.consentUrl || data?.consent?.url || data?.redirectUrl || null;
    return res.status(200).json({ ok: true, data, redirectUrl });
  } catch (err) {
    console.error("create consent error", err);
    return res.status(500).json({ error: "internal", detail: err && err.message ? err.message : null });
  }
}


// ---------- webhook notifications ----------
async function handleNotifications(req, res) {
  // We accept express.raw() on this route; req.body may be Buffer, string or object.
  try {
    // Debug logging
    console.log("Webhook raw body type:", typeof req.body);
    console.log("Webhook raw body sample:", req.body);

    // Ensure we have an object in `event`
    let event;
    if (Buffer.isBuffer(req.body)) {
      event = JSON.parse(req.body.toString());
    } else if (typeof req.body === "string") {
      event = JSON.parse(req.body);
    } else {
      event = req.body;
    }

    const eventId = event?.notificationId || event?.meta?.requestId || null;
    const eventType = event?.eventType || event?.type || "unknown";

    const pool = db.pool;
    const client = await pool.connect();

    try {
      // prevent duplicates
      if (eventId) {
        const r = await client.query("SELECT 1 FROM webhook_events WHERE event_id=$1", [eventId]);
        if (r.rowCount > 0) {
          client.release();
          return res.status(200).send("duplicate");
        }
        await client.query("INSERT INTO webhook_events (event_id, event_type, payload) VALUES ($1,$2,$3)", [
          eventId,
          eventType,
          JSON.stringify(event),
        ]);
      }

      // -----------------------------
      // Consent accepted/active -> insert accounts and (optionally) create data session
      // eventType for consent acceptance may be: CONSENT_ACCEPTED, CONSENT_APPROVED, or CONSENT_STATUS_UPDATE with status ACTIVE
      if (["CONSENT_ACCEPTED", "CONSENT_APPROVED"].includes(eventType) ||
        (eventType === "CONSENT_STATUS_UPDATE" && event?.data?.status === "ACTIVE")) {

        const consentId = event?.data?.consentId || event?.consentId || event?.data?.id;

        // update consent status & raw_response
        await client.query("UPDATE consents SET status=$1, raw_response=$2 WHERE consent_id=$3", [
          "ACTIVE",
          JSON.stringify(event),
          consentId,
        ]);

        // If the notification contains account metadata (connected accounts), insert them
        // Structure observed in webhook: event.data.detail.accounts -> array of { fipId, fiType, maskedAccNumber, accType, linkRefNumber }
        const accountsFromNotification = event?.data?.detail?.accounts;
        if (Array.isArray(accountsFromNotification) && accountsFromNotification.length > 0) {
          const userIdForConsent = await mapConsentToUser(consentId);
          if (!userIdForConsent) {
            console.error(`[handleNotifications] no user mapped for consent ${consentId} — skipping account inserts`);
          }
          else{
          for (const a of accountsFromNotification) {
            try {
              // attempt upsert by unique tuple (consent_id + linkRefNumber)
              const fipAccountId = a.linkRefNumber || a.linkRef || null;
              // check existing
              const ex = await client.query(
                `SELECT id FROM accounts WHERE consent_id=$1 AND fip_account_id=$2 LIMIT 1`,
                [consentId, fipAccountId]
              );
              if (ex.rowCount > 0) {
                // update
                await client.query(
                  `UPDATE accounts SET bank_name=$1, account_masked=$2, account_type=$3, raw_meta=$4 WHERE id=$5`,
                  [a.fipId || null, a.maskedAccNumber || null, a.accType || null, JSON.stringify(a), ex.rows[0].id]
                );
              } else {
                await client.query(
                  `INSERT INTO accounts (user_id, consent_id, fip_account_id, bank_name, account_masked, account_type, currency, raw_meta)
                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                  [userIdForConsent, consentId, fipAccountId, a.fipId || null, a.maskedAccNumber || null, a.accType || null, "INR", JSON.stringify(a)]
                );
              }
            } catch (err) {
              console.error("Failed to insert account from consent notification:", err);
            }
          }
        }
        }

        // If AUTO_FETCH is disabled we create the data-session manually.
        if (!AUTO_FETCH) {
          // Decide if we are allowed to create a session for this consent:
          // - If fetchType is ONETIME: only create if no PENDING/READY/FETCHED data session exists.
          // - If fetchType is PERIODIC: always create.
          // fetch type is stored in consents.raw_response or consents.auto_fetch
          let fetchType = "ONETIME";
          try {
            const cr = await client.query("SELECT raw_response, auto_fetch FROM consents WHERE consent_id=$1 LIMIT 1", [consentId]);
            if (cr.rowCount > 0) {
              const raw = cr.rows[0].raw_response;
              if (raw && raw.detail.fetchType) fetchType = raw.detail.fetchType.toUpperCase();
            }
          } catch (err) {
            console.error("Could not read consent fetchType:", err);
          }

          if (fetchType === "PERIODIC") {
            // create a data session always (periodic allowed multiple)
            try {
              // compute a sensible from/to for this session
              let consentRange;
              const rr = await client.query("SELECT consent_date_range FROM consents WHERE consent_id=$1 LIMIT 1", [consentId]);
              if (rr.rowCount === 0) {
                return res.status(404).json({ error: "consent not found" });
              }
              consentRange = rr.rows[0].consent_date_range || null;

              const now = new Date();
              let sessionTo = new Date(now); // e.g., to now (or now + 1 day)
              const sessionFrom = new Date(now);
              sessionFrom.setMonth(sessionFrom.getMonth() - 6); // last 6 months

              // ensure sessionTo <= consentExpiry if consentRange is available
              if (consentRange && consentRange.to) {
                const consentTo = new Date(consentRange.to);
                if (sessionTo > consentTo) sessionTo = consentTo;
              }

              // call helper:
              const ds = await createDataSessionHelper(consentId, { from: sessionFrom.toISOString(), to: sessionTo.toISOString() });
              const dataSessionId = ds?.id || ds?.dataSessionId || ds?.dataSession?.id;
              if (dataSessionId) {
                await client.query(
                  `INSERT INTO data_sessions (data_session_id, consent_id, status, raw_response)
                   VALUES ($1,$2,$3,$4)
                   ON CONFLICT (data_session_id) DO NOTHING`,
                  [dataSessionId, consentId, ds.status || "PENDING", JSON.stringify(ds)]
                );
              } else {
                console.error("[createDataSession] no dataSessionId returned for periodic consent", ds);
              }
            } catch (err) {
              console.error("[createDataSession] periodic create failed:", err && err.message ? err.message : err);
            }
          } else {
            // ONETIME: check if existing active/pending fetched session already exists
            const existing = await client.query(
              `SELECT 1 FROM data_sessions WHERE consent_id = $1 AND status IN ('PENDING','READY','FETCHED') LIMIT 1`,
              [consentId]
            );
            if (existing.rowCount > 0) {
              console.log(`[createDataSession] data session already exists for consent ${consentId}, skipping creation`);
            } else {
              try {
                let consentRange;
                const rr = await client.query("SELECT consent_date_range FROM consents WHERE consent_id=$1 LIMIT 1", [consentId]);
                if (rr.rowCount === 0) {
                  return res.status(404).json({ error: "consent not found" });
                }
                consentRange = rr.rows[0].consent_date_range || null;

                const now = new Date();
                let sessionTo = new Date(now); // e.g., to now (or now + 1 day)
                const sessionFrom = new Date(now);
                sessionFrom.setMonth(sessionFrom.getMonth() - 6); // last 6 months

                // ensure sessionTo <= consentExpiry if consentRange is available
                if (consentRange && consentRange.to) {
                  const consentTo = new Date(consentRange.to);
                  if (sessionTo > consentTo) sessionTo = consentTo;
                }

                // call helper:
                const ds = await createDataSessionHelper(consentId, { from: sessionFrom.toISOString(), to: sessionTo.toISOString() });
                const dataSessionId = ds?.id || ds?.dataSessionId || ds?.dataSession?.id;
                if (dataSessionId) {
                  await client.query(
                    `INSERT INTO data_sessions (data_session_id, consent_id, status, raw_response)
                     VALUES ($1,$2,$3,$4)
                     ON CONFLICT (data_session_id) DO NOTHING`,
                    [dataSessionId, consentId, ds.status || "PENDING", JSON.stringify(ds)]
                  );
                } else {
                  console.error("[createDataSession] no dataSessionId returned for onetime consent", ds);
                }
              } catch (err) {
                console.error("[createDataSession] onetime create failed:", err && err.message ? err.message : err);
                try {
                  await client.query(
                    `INSERT INTO data_sessions (consent_id, status, raw_response)
                     VALUES ($1,$2,$3)`,
                    [consentId, "FAILED", JSON.stringify({ error: err && err.message ? err.message : String(err) })]
                  );
                } catch (inner) {
                  console.error("failed to persist failed data_session row:", inner);
                }
              }
            }
          }
        }

      } else if (eventType === "SESSION_STATUS_UPDATE") {
        // Session status update: when status is COMPLETED or PARTIAL -> fetch
        const dataSessionId =
          event?.data?.dataSessionId ||
          event?.dataSessionId ||
          event?.data?.id ||
          event?.data?.sessionId ||
          event?.dataSessionId;

        const sessionStatus = (event?.data?.status || "").toString().toUpperCase();

        console.log(`[Webhook] SESSION_STATUS_UPDATE for data session: ${dataSessionId}, status: ${sessionStatus}`);

        if (!dataSessionId) {
          console.error("[Webhook] Missing dataSessionId in SESSION_STATUS_UPDATE event");
          // still return 200 because it's a notification but log
          return res.status(200).send("ok");
        }

        if (sessionStatus === "COMPLETED" || sessionStatus === "PARTIAL") {
          // mark ready
          await client.query(
            `UPDATE data_sessions SET status=$1, ready_at=NOW(), raw_response=$2 WHERE data_session_id=$3`,
            ["READY", JSON.stringify(event), dataSessionId]
          );

          try {
            // fetch FI data and persist
            console.log(`[Webhook] Fetching FI data for data session: ${dataSessionId}`);
            const fiData = await fetchFIDataBySession(dataSessionId);
            await persistFIData(fiData);
            await client.query(
              `UPDATE data_sessions SET status=$1, fetched_at=NOW(), raw_response = $3 WHERE data_session_id=$2`,
              ["FETCHED", dataSessionId, JSON.stringify(fiData)]
            );
            console.log(`[Webhook] FI data successfully fetched and persisted for ${dataSessionId}`);
          } catch (err) {
            console.error(`[Webhook] Failed to fetch FI data for ${dataSessionId}:`, err && err.message ? err.message : err);
            await client.query(`UPDATE data_sessions SET status=$1, raw_response=$2 WHERE data_session_id=$3`, [
              "FAILED",
              JSON.stringify({ error: err && err.message ? err.message : String(err) }),
              dataSessionId,
            ]);
          }
        } else if (sessionStatus === "FAILED" || sessionStatus === "ERROR") {
          await client.query(
            `UPDATE data_sessions SET status=$1, raw_response=$2 WHERE data_session_id=$3`,
            ["FAILED", JSON.stringify(event), dataSessionId]
          );
          console.log(`[Webhook] Data session ${dataSessionId} marked as FAILED`);
        } else {
          console.log(`[Webhook] Ignored session status: ${sessionStatus} for ${dataSessionId}`);
        }
      } else if (eventType === "CONSENT_REVOKED" || (eventType === "CONSENT_STATUS_UPDATE" && event?.data?.status === "REVOKED")) {
        const consentId = event?.data?.consentId || event?.consentId || event?.data?.id;
        await client.query("UPDATE consents SET status=$1, raw_response=$2 WHERE consent_id=$3", [
          "REVOKED",
          JSON.stringify(event),
          consentId,
        ]);
      } else {
        // Unknown / ignored eventType
        console.log("[Webhook] Ignored event type:", eventType);
      }
    } finally {
      client.release();
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error("webhook handler error", err && err.message ? err.message : err);
    res.status(500).send("error");
  }
}


// ---------- manual create data session ----------
async function createDataSession(req, res) {
  try {
    const { consentId, from: reqFrom, to: reqTo } = req.body;
    if (!consentId) return res.status(400).json({ error: "consentId required" });

    // read consent_date_range from DB
    const pool = db.pool;
    const client = await pool.connect();
    let consentRange;
    try {
      const rr = await client.query("SELECT consent_date_range FROM consents WHERE consent_id=$1 LIMIT 1", [consentId]);
      if (rr.rowCount === 0) {
        return res.status(404).json({ error: "consent not found" });
      }
      consentRange = rr.rows[0].consent_date_range || null;
    } finally {
      client.release();
    }

    // parse and normalize requested range
    const defaultFrom = new Date();
    defaultFrom.setMonth(defaultFrom.getMonth() - 6);
    const fromDate = reqFrom ? new Date(reqFrom) : defaultFrom;
    const toDate = reqTo ? new Date(reqTo) : new Date(); // default to now

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: "invalid from/to date" });
    }
    if (fromDate > toDate) {
      return res.status(400).json({ error: "`from` must be <= `to`" });
    }

    // If consentRange exists, ensure requested 'to' is <= consentRange.to
    if (consentRange && consentRange.to) {
      const consentTo = new Date(consentRange.to);
      if (toDate > consentTo) {
        // Option A: reject
        return res.status(400).json({ error: "requested `to` is beyond consent expiry", consentExpiry: consentRange.to });

        // Option B (alternative): cap `to` to consentTo and continue
        // toDate = consentTo;
      }
    }

    // call helper to create session with validated from/to strings
    const ds = await createDataSessionHelper(consentId, { from: fromDate.toISOString(), to: toDate.toISOString() });

    // persist ds (same as existing)
    const client2 = await pool.connect();
    try {
      const dataSessionId = ds?.id || ds?.dataSessionId || ds?.dataSession?.id;
      await client2.query(
        `INSERT INTO data_sessions (data_session_id, consent_id, status, raw_response)
         VALUES ($1,$2,$3,$4) ON CONFLICT (data_session_id) DO NOTHING`,
        [dataSessionId, consentId, ds.status || "PENDING", JSON.stringify(ds)]
      );
    } finally {
      client2.release();
    }

    return res.json(ds);
  } catch (err) {
    console.error("create data session error", err);
    return res.status(500).json({ error: "internal" });
  }
}


// ---------- manual fetch FI ----------
async function fetchFIBySession(req, res) {
  try {
    const sessionId = req.params.sessionId;
    const fi = await fetchFIDataBySession(sessionId);
    const pool = db.pool;
    const client = await pool.connect();
    try {
      await persistFIData(fi);
      await client.query("UPDATE data_sessions SET status=$1, fetched_at=now() WHERE data_session_id=$2", [
        "FETCHED",
        sessionId,
      ]);
    } finally {
      client.release();
    }
    res.json(fi);
  } catch (err) {
    console.error("fetch FI endpoint error", err && err.message ? err.message : err);
    res.status(500).json({ error: "internal" });
  }
}

// ---------- revoke consent ----------
// inside backend/controllers/setuController.js (replace revokeConsent implementation)
async function revokeConsent(req, res) {
  try {
    const consentId = req.params.consentId;

    // call Setu revoke
    const r = await fetchWithSetu(`${SETU_BASE}/consents/${consentId}/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-product-instance-id": PRODUCT_INSTANCE_ID,
      },
      body: JSON.stringify({ reason: req.body.reason || "User requested revoke" }),
    });

    const data = await (async () => {
      try { return await r.json(); } catch (e) { return { _raw: await r.text().catch(() => "<no-body>") }; }
    })();

    // Update consent status and raw response
    const pool = db.pool;
    const client = await pool.connect();
    try {
      await client.query("UPDATE consents SET status=$1, raw_response=$2 WHERE consent_id=$3", [
        "REVOKED",
        JSON.stringify(data),
        consentId,
      ]);

      // Remove related transactions and accounts for privacy / cleanup
      // Delete transactions first (FK to accounts), then accounts.
      try {
        await client.query("DELETE FROM transactions WHERE consent_id=$1", [consentId]);
        await client.query("DELETE FROM accounts WHERE consent_id=$1", [consentId]);
        console.log(`[revokeConsent] deleted accounts & transactions for consent ${consentId}`);
      } catch (cleanupErr) {
        console.error("[revokeConsent] cleanup failed:", cleanupErr);
        // don't abort the whole flow; we already updated consents.
      }
    } finally {
      client.release();
    }

    return res.json({ ok: true, setuResponse: data });
  } catch (err) {
    console.error("revoke consent error:", err && err.message ? err.message : err);
    return res.status(500).json({ error: "internal" });
  }
}



// ---------- helpers ----------

/**
 * createDataSessionHelper
 * - Accepts opts.from / opts.to (Date or string). If not provided uses fallback default
 */
async function createDataSessionHelper(consentId, opts = {}) {


  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setMonth(defaultFrom.getMonth() - 6); // last 6 months
  const defaultTo = now;

  const fromRaw = opts.from ? new Date(opts.from) : defaultFrom;
  const toRaw = opts.to ? new Date(opts.to) : defaultTo;

  if (isNaN(fromRaw.getTime()) || isNaN(toRaw.getTime())) {
    throw new Error("Invalid from/to dates passed to createDataSessionHelper");
  }
  if (fromRaw > toRaw) {
    throw new Error("`from` date must be earlier than or equal to `to` date");
  }

  const payload = {
    consentId,
    dataRange: {
      from: fromRaw.toISOString(),
      to: toRaw.toISOString(),
    },
    format: "json",
  };

  console.log("[createDataSessionHelper] payload:", JSON.stringify(payload));

  const r = await fetchWithSetu(`${SETU_BASE}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-product-instance-id": PRODUCT_INSTANCE_ID,
    },
    body: JSON.stringify(payload),
  });

  // read text for robust debug
  const text = await r.text().catch(() => "<no-body>");
  let body;
  try {
    body = JSON.parse(text);
  } catch (e) {
    body = { _raw: text };
  }

  console.log("[createDataSessionHelper] setu status:", r.status, "body:", body);

  if (!r.ok) {
    const err = new Error("Setu create data-session failed");
    err.status = r.status;
    err.body = body;
    throw err;
  }

  return body;
}

async function fetchFIDataBySession(sessionId) {
  const r = await fetchWithSetu(`${SETU_BASE}/sessions/${sessionId}`, {
    method: "GET",
    headers: { "x-product-instance-id": PRODUCT_INSTANCE_ID },
  });
  if (!r.ok) throw new Error("fetch FI failed " + r.status);
  return await r.json();
}

/**
 * persistFIData
 * - Accepts both shapes:
 *   - { fips: [{ accounts: [ { data: { account: ... } }, ... ] }] }
 *   - { accounts: [ ... ] } (older shape)
 *
 * - Upserts accounts and inserts transactions, basic de-duplication by unique ref fields.
 */
async function persistFIData(fiPayload) {
  const pool = db.pool;
  const client = await pool.connect();

  try {
    const consentId = fiPayload?.consentId || fiPayload?.consent?.id;
    const userId = await mapConsentToUser(consentId);

    // Normalize to an array of account objects with structure { linkedAccRef, maskedAccNumber, account, transactions }
    const normalizedAccounts = [];

    if (Array.isArray(fiPayload?.fips)) {
      for (const fip of fiPayload.fips) {
        if (Array.isArray(fip.accounts)) {
          for (const acc of fip.accounts) {
            // acc might be like { maskedAccNumber, data: { account: {...} }, FIstatus, linkRefNumber }
            const accountObj = acc.data && acc.data.account ? acc.data.account : acc;
            const linkedRef = (accountObj && accountObj.linkedAccRef) || acc.linkRefNumber || acc.linkRef || acc.linkedAccRef || null;
            const masked = accountObj && accountObj.maskedAccNumber ? accountObj.maskedAccNumber : acc.maskedAccNumber || null;
            const summary = accountObj && accountObj.summary ? accountObj.summary : null;
            const profile = accountObj && accountObj.profile ? accountObj.profile : null;
            const transactions = (accountObj && accountObj.transactions && (accountObj.transactions.transaction || accountObj.transactions)) || (acc.transactions || []);
            normalizedAccounts.push({
              linkedRef,
              masked,
              accountObj,
              summary,
              profile,
              transactions,
            });
          }
        }
      }
    } else if (Array.isArray(fiPayload?.accounts)) {
      for (const acc of fiPayload.accounts) {
        // older shape: acc may contain account + transactions
        const accountObj = acc.data && acc.data.account ? acc.data.account : acc;
        const linkedRef = (accountObj && accountObj.linkedAccRef) || acc.accountId || acc.fipAccountId || null;
        const masked = accountObj && accountObj.maskedAccNumber ? accountObj.maskedAccNumber : acc.maskedAccount || null;
        const summary = accountObj && accountObj.summary ? accountObj.summary : null;
        const profile = accountObj && accountObj.profile ? accountObj.profile : null;
        const transactions = (accountObj && accountObj.transactions && (accountObj.transactions.transaction || accountObj.transactions)) || (acc.transactions || []);
        normalizedAccounts.push({
          linkedRef,
          masked,
          accountObj,
          summary,
          profile,
          transactions,
        });
      }
    }

    // persist each normalized account
    for (const na of normalizedAccounts) {
      try {
        // Upsert account row using consentId + linkedRef (best-effort)
        let accountRow = null;
        if (na.linkedRef) {
          const r = await client.query(
            `SELECT id FROM accounts WHERE consent_id=$1 AND fip_account_id=$2 LIMIT 1`,
            [consentId, na.linkedRef]
          );
          if (r.rowCount > 0) accountRow = r.rows[0];
        }

        if (!accountRow) {
          // try matching by masked number as fallback
          if (na.masked) {
            const r2 = await client.query(
              `SELECT id FROM accounts WHERE consent_id=$1 AND account_masked=$2 LIMIT 1`,
              [consentId, na.masked]
            );
            if (r2.rowCount > 0) accountRow = r2.rows[0];
          }
        }

        let accountId;
        if (accountRow) {
          accountId = accountRow.id;
          await client.query(
            `UPDATE accounts SET raw_meta=$1, account_masked=$2, fip_account_id=$3, account_type=$4, currency=$5 WHERE id=$6`,
            [JSON.stringify(na.accountObj), na.masked, na.linkedRef, (na.summary && na.summary.type) || null, (na.summary && na.summary.currency) || "INR", accountId]
          );
        } else {
          const ins = await client.query(
            `INSERT INTO accounts (user_id, consent_id, fip_account_id, bank_name, account_masked, account_type, currency, raw_meta)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
            [
              userId,
              consentId,
              na.linkedRef,
              null,
              na.masked,
              (na.summary && na.summary.type) || null,
              (na.summary && na.summary.currency) || "INR",
              JSON.stringify(na.accountObj),
            ]
          );
          accountId = ins.rows[0].id;
        }

        // Optionally persist profile & summary (you can create tables if you want).
        // For now we keep profile and summary inside accounts.raw_meta which we already store.

        // Persist transactions: normalize to array
        const txs = Array.isArray(na.transactions) ? na.transactions : (na.transactions ? [na.transactions] : []);
        for (const t of txs) {
          // Derive a stable unique key for the transaction if possible (txnId or reference)
          const txnId = t.txnId || t.reference || t.txnId || t.transactionId || t.txnId || null;
          // Basic dedupe check by txn id + account + consent
          if (txnId) {
            const exists = await client.query(
              `SELECT 1 FROM transactions WHERE txn_ref=$1 AND account_id=$2 LIMIT 1`,
              [String(txnId), accountId]
            );
            if (exists.rowCount > 0) continue; // skip
          }

          // parse amount and date safely
          const amount = parseFloat(t.amount || t.value || t.transactionAmount || 0) || parseFloat(t.amount || 0) || 0;
          const currency = t.currency || "INR";
          // Prefer valueDate / transactionTimestamp / date fields
          const dateStr = t.valueDate || t.transactionTimestamp || t.transactionTimestamp || t.date || t.txnDate || null;
          let dateVal = null;
          if (dateStr) {
            try {
              // some dates are YYYY-MM-DD, some are ISO
              dateVal = new Date(dateStr);
              if (isNaN(dateVal.getTime())) dateVal = null;
            } catch (e) {
              dateVal = null;
            }
          }

          const narration = t.narration || t.description || t.narration || t.remark || null;

          await client.query(
            `INSERT INTO transactions (user_id, account_id, consent_id, amount, currency, txn_date, narration, category, raw_meta,txn_ref)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [userId, accountId, consentId, amount, currency, dateVal ? dateVal.toISOString().split("T")[0] : null, narration, t.type || null, JSON.stringify(t), String(txnId)]
          );
        }
      } catch (err) {
        console.error("persistFIData account loop error:", err && err.message ? err.message : err);
      }
    }
  } finally {
    client.release();
  }
}

async function mapConsentToUser(consentId) {
  const pool = db.pool;
  const client = await pool.connect();
  try {
    const r = await client.query("SELECT user_id FROM consents WHERE consent_id=$1", [consentId]);
    return r.rows[0]?.user_id;
  } finally {
    client.release();
  }
}

module.exports = {
  createConsent,
  handleNotifications,
  createDataSession,
  fetchFIBySession,
  revokeConsent,
};
