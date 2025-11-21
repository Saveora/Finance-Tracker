// backend/controllers/dashboardController.js
const db = require('../db');

/**
 * GET /api/dashboard/summary
 */
async function summary(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    const userId = req.user.id;
    const accountId = req.query.accountId;
    const breakdown = req.query.breakdown === '1' || req.query.breakdown === 'true';


    const params = [userId];
    let where = `WHERE t.user_id = $1`;

    if (accountId) {
      params.push(accountId);
      where += ` AND t.account_id = $${params.length}`;
    }

    const typeExpr = `lower(coalesce(t.category,
                              (t.raw_meta->>'type'),
                              (t.raw_meta->>'txnType'),
                              (t.raw_meta->>'transactionType'),
                              ''))`;


    const totalsSql = `
      SELECT
        COALESCE(SUM(
          CASE
            WHEN (t.amount < 0 OR ${typeExpr} = 'debit') THEN abs(t.amount)
            ELSE 0
          END
        ), 0)::numeric AS total_debit,
        COALESCE(SUM(
          CASE
            WHEN (t.amount < 0 OR ${typeExpr} = 'debit') THEN 0
            ELSE t.amount
          END
        ), 0)::numeric AS total_credit,
        COALESCE(SUM(t.amount), 0)::numeric AS balance,
        COALESCE(COUNT(*)::int, 0) AS total_count
      FROM transactions t
      ${where}
    `;

    const totalsRes = await db.pool.query(totalsSql, params);
    const totalsRow = totalsRes.rows[0] || { total_debit: 0, total_credit: 0, balance: 0, total_count: 0 };

    const result = {
      ok: true,
      totals: {
        total_credit: Number(totalsRow.total_credit || 0),
        total_debit: Number(totalsRow.total_debit || 0),
        balance: Number(totalsRow.balance || 0),
        total_count: Number(totalsRow.total_count || 0),
      },
    };

    if (breakdown) {
      // Provide per-account breakdown (user-level)
      const params2 = params.slice();
      // group by account id and show account info from accounts table
      const perAccountSql = `
        SELECT
          a.id AS account_id,
          a.bank_name,
          a.account_masked,
          COALESCE(SUM(
            CASE
              WHEN (t.amount < 0 OR ${typeExpr} = 'debit') THEN abs(t.amount)
              ELSE 0
            END
          ), 0)::numeric AS total_debit,
          COALESCE(SUM(
            CASE
              WHEN (t.amount < 0 OR ${typeExpr} = 'debit') THEN 0
              ELSE t.amount
            END
          ), 0)::numeric AS total_credit,
          COALESCE(SUM(t.amount), 0)::numeric AS balance,
          COALESCE(COUNT(*)::int, 0) AS txn_count
        FROM transactions t
        LEFT JOIN accounts a ON a.id = t.account_id
        ${where}
        GROUP BY a.id, a.bank_name, a.account_masked
        ORDER BY a.bank_name NULLS LAST, a.id;
      `;
      const perAccountRes = await db.pool.query(perAccountSql, params2);
      result.accounts = perAccountRes.rows.map(r => ({
        account_id: r.account_id,
        bank_name: r.bank_name,
        account_masked: r.account_masked,
        total_credit: Number(r.total_credit || 0),
        total_debit: Number(r.total_debit || 0),
        balance: Number(r.balance || 0),
        txn_count: Number(r.txn_count || 0),
      }));
    }

    return res.json(result);
  } catch (err) {
    console.error('dashboard.summary error', err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: 'internal' });
  }
}

module.exports = { summary };
