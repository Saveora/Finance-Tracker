// backend/controllers/transactionsController.js
const db = require('../db');

async function listTransactions(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }

    const userId = req.user.id;
    const limit = Math.min(200, parseInt(req.query.limit || "50", 10));
    const offset = Math.max(0, parseInt(req.query.offset || "0", 10));
    const accountId = req.query.accountId;
    const consentId = req.query.consentId;

    // ---- Build WHERE filters ----
    const params = [userId]; // $1 = userId
    const whereParts = [`t.user_id = $1`]; // always filter by user

    if (accountId) {
      params.push(accountId);
      whereParts.push(`t.account_id = $${params.length}`);
    }

    if (consentId) {
      params.push(consentId);
      whereParts.push(`t.consent_id = $${params.length}`);
    }

    const whereSql = `WHERE ${whereParts.join(' AND ')}`;

    // ---- 1) Total count ----
    const totalSql = `
      SELECT COUNT(*)::int AS total
      FROM transactions t
      ${whereSql}
    `;
    const totalRes = await db.pool.query(totalSql, params);
    const total = totalRes.rows[0] ? Number(totalRes.rows[0].total || 0) : 0;

    // ---- 2) Fetch paginated rows ----
    const paramsForRows = params.slice();
    paramsForRows.push(limit);
    paramsForRows.push(offset);

    const rowsSql = `
      SELECT
        t.id::text,
        t.amount::float AS amount,
        t.currency,
        t.txn_date,
        t.narration,
        t.raw_meta,
        t.txn_ref,
        t.consent_id,
        a.id AS account_id,
        a.bank_name,
        a.account_masked
      FROM transactions t
      LEFT JOIN accounts a ON a.id = t.account_id
      ${whereSql}
      ORDER BY t.created_at DESC
      LIMIT $${paramsForRows.length - 1} OFFSET $${paramsForRows.length}
    `;

    const r = await db.pool.query(rowsSql, paramsForRows);

    // ---- Map to frontend shape ----
    const txns = r.rows.map((row) => {
      const raw = row.raw_meta || {};
      let amountNum = Number(row.amount || 0);
      let direction = 'credit';

      if (!Number.isFinite(amountNum)) amountNum = 0;
      if (amountNum < 0) {
        direction = 'debit';
        amountNum = Math.abs(amountNum);
      } else {
        const rtype = raw?.type || raw?.txnType || raw?.transactionType || raw?.txn_type;
        if (rtype && String(rtype).toUpperCase() === 'DEBIT') direction = 'debit';
      }

      const txnId = raw.txnId || raw.transactionId || raw.reference || row.txn_ref || row.id;

      return {
        id: String(txnId),
        description: row.narration || raw.narration || raw.description || '',
        date: row.txn_date ? new Date(row.txn_date).toISOString() : raw.transactionTimestamp || raw.valueDate || new Date().toISOString(),
        status: raw.status || 'Completed',
        amount: amountNum,
        currency: row.currency || raw.currency || 'INR',
        direction,
        sender: raw.sender || (direction === 'debit' ? 'Me' : (raw.from || 'Other')),
        recipient: raw.recipient || (direction === 'credit' ? 'Me' : (raw.to || 'Other')),
        account: {
          id: row.account_id,
          bankName: row.bank_name,
          masked: row.account_masked
        },
        raw
      };
    });

    return res.json({ ok: true, transactions: txns, total });

  } catch (err) {
    console.error("listTransactions error", err);
    return res.status(500).json({ ok: false, error: "internal" });
  }
}

module.exports = { listTransactions };
