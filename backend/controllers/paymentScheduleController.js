// backend/controllers/paymentScheduleController.js
const db = require("../db");

function mapRowToSchedule(row) {
  if (!row) return null;
  let startDate = null;
  try {
    if (row.start_date instanceof Date) startDate = row.start_date.toISOString();
    else if (row.start_date) startDate = new Date(row.start_date).toISOString();
  } catch (e) {
    startDate = row.start_date || null;
  }

  return {
    id: String(row.id),
    title: row.title,
    amount: Number(row.amount),
    currency: row.currency || "INR",
    method: row.method,
    payee: row.payee,
    startDate,
    recurrence: row.recurrence,
    note: row.note,
    active: !!row.is_active,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    _raw: row,
  };
}


function resolveUserId(req) {
  if (req.user && req.user.id) return Number(req.user.id);

  if (req.query && req.query.userId) {
    const q = Number(req.query.userId);
    if (!Number.isNaN(q) && q > 0) return q;
  }

  if (req.body && req.body.userId) {
    const b = Number(req.body.userId);
    if (!Number.isNaN(b) && b > 0) return b;
  }

  const header = req.get && (req.get("x-user-id") || req.headers["x-user-id"]);
  if (header) {
    const h = Number(header);
    if (!Number.isNaN(h) && h > 0) return h;
  }

  return null;
}

/* ----------------- CONTROLLERS ----------------- */

async function createSchedule(req, res) {
  try {
    const {
      title,
      amount,
      currency = "INR",
      method,
      payee,
      startDate,
      recurrence,
      note = "",
      active = true,
    } = req.body || {};

    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ ok: false, message: "userId required" });

    const pool = db.pool;
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO payment_schedules 
          (title, amount, currency, method, payee, start_date, recurrence, note, is_active, user_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [title, amount, currency, method, payee, startDate, recurrence, note, active, userId]
      );
      const row = result.rows[0];
      return res.status(201).json(mapRowToSchedule(row));
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("createSchedule error:", err);
    return res.status(500).json({ ok: false, message: "Server error while creating schedule" });
  }
}

async function getSchedules(req, res) {
  try {
    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ ok: false, message: "userId required" });

    const pool = db.pool;
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM payment_schedules WHERE user_id = $1 ORDER BY start_date ASC`,
        [userId]
      );
      const schedules = result.rows.map(mapRowToSchedule);
      return res.json({ ok: true, schedules });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("getSchedules error:", err);
    return res.status(500).json({ ok: false, message: "Server error while fetching schedules" });
  }
}

async function updateSchedule(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      amount,
      currency = "INR",
      method,
      payee,
      startDate,
      recurrence,
      note = "",
      active = true,
    } = req.body || {};

    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ ok: false, message: "userId required" });

    const pool = db.pool;
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE payment_schedules
         SET title=$1, amount=$2, currency=$3, method=$4, payee=$5, start_date=$6, recurrence=$7, note=$8, is_active=$9, updated_at=NOW()
         WHERE id=$10 AND user_id=$11
         RETURNING *`,
        [title, amount, currency, method, payee, startDate, recurrence, note, active, id, userId]
      );

      if (result.rowCount === 0)
        return res.status(404).json({ ok: false, message: "Schedule not found or not owned by user" });

      return res.json(mapRowToSchedule(result.rows[0]));
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("updateSchedule error:", err);
    return res.status(500).json({ ok: false, message: "Server error while updating schedule" });
  }
}

async function deleteSchedule(req, res) {
  try {
    const { id } = req.params;
    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ ok: false, message: "userId required" });

    const pool = db.pool;
    const client = await pool.connect();
    try {
      const del = await client.query(
        `DELETE FROM payment_schedules WHERE id = $1 AND user_id = $2 RETURNING id`,
        [id, userId]
      );
      if (del.rowCount === 0)
        return res.status(404).json({ ok: false, message: "Schedule not found or not owned by user" });

      return res.json({ ok: true, message: "Schedule deleted", id: String(del.rows[0].id) });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("deleteSchedule error:", err);
    return res.status(500).json({ ok: false, message: "Server error while deleting schedule" });
  }
}

async function toggleSchedule(req, res) {
  try {
    const { id } = req.params;
    const userId = resolveUserId(req);
    if (!userId) return res.status(401).json({ ok: false, message: "userId required" });

    const pool = db.pool;
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE payment_schedules
         SET is_active = NOT is_active, updated_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [id, userId]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ ok: false, message: "Schedule not found or not owned by user" });

      return res.json(mapRowToSchedule(result.rows[0]));
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("toggleSchedule error:", err);
    return res.status(500).json({ ok: false, message: "Server error while toggling schedule" });
  }
}

module.exports = {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
  toggleSchedule,
};
