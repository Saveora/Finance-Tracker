// backend/controllers/accountsController.js
const db = require('../db');

async function listAccounts(req, res) {
  try {
    // requireAuth sets req.user = { id, email, display_name }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }

    const userId = req.user.id;
    const { consentId } = req.query;

   
    const params = [userId];
    let q = `SELECT
               id,
               user_id,
               consent_id,
               fip_account_id,
               bank_name,
               account_masked,
               account_type,
               currency,
               raw_meta,
               created_at
             FROM accounts
             WHERE user_id = $1`;

    if (consentId) {
      params.push(consentId);
      q += ` AND consent_id = $${params.length}`;
    }

    q += ` ORDER BY created_at DESC`;

    const r = await db.pool.query(q, params);
    return res.json({ ok: true, accounts: r.rows });
  } catch (err) {
    console.error("listAccounts error", err);
    return res.status(500).json({ ok: false, error: "internal" });
  }
}

async function getAccount(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    const id = req.params.id;

    // Ensure the account belongs to the logged-in user
    const accountRes = await db.pool.query(
      `SELECT * FROM accounts WHERE id=$1 AND user_id=$2 LIMIT 1`,
      [id, req.user.id]
    );

    if (accountRes.rowCount === 0) return res.status(404).json({ ok: false, error: "not found" });

    const account = accountRes.rows[0];
    const txRes = await db.pool.query(
      `SELECT * FROM transactions WHERE account_id=$1 ORDER BY created_at DESC`,
      [id]
    );

    return res.json({ ok: true, account, transactions: txRes.rows });
  } catch (err) {
    console.error("getAccount error", err);
    return res.status(500).json({ ok: false, error: "internal" });
  }
}

module.exports = { listAccounts, getAccount };
