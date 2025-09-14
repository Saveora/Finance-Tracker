const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const db = require("../db"); // adjust path if needed
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/user.phonenumbers.read",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 🔹 Call Google People API for phone numbers
        let phone = null;
        try {
          const resp = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const people = await resp.json();
          phone = people.phoneNumbers?.[0]?.value || null;
        } catch (err) {
          console.error("Error fetching phone number:", err.message);
        }

        // 🔹 Generate a base username (from displayName or email local-part)
        let baseUsername =
          profile.displayName?.replace(/\s+/g, "").toLowerCase() ||
          email.split("@")[0].toLowerCase();

        // 🔹 Ensure username is unique in DB
        let username = baseUsername;
        let suffix = 1;
        let check = await db.query("SELECT * FROM users WHERE username = $1", [
          username,
        ]);

        while (check.rows.length) {
          username = `${baseUsername}${suffix}`;
          suffix++;
          check = await db.query("SELECT * FROM users WHERE username = $1", [
            username,
          ]);
        }

        // 🔹 Check if user already exists
        let user = await db.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);

        if (!user.rows.length) {
          // Insert new user
          user = await db.query(
            `INSERT INTO users (email, display_name, provider, phone, username)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [email, profile.displayName, "google", phone, username]
          );
          user = user.rows[0];
        } else {
          user = user.rows[0];
        }

        // 🔹 Generate JWT
        const token = jwt.sign(
          { id: user.user_id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
