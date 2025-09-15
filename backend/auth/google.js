// backend/auth/google.js
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const db = require("../db");
const {
  signAccessToken,
  createRefreshToken,
  hashRefreshToken,
  refreshExpiresAt,
} = require("../auth/tokens");

// We enable passReqToCallback so we can read req.ip / user-agent and create session here.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/user.phonenumbers.read",
      ],
    },
    // signature when passReqToCallback=true => (req, accessToken, refreshToken, profile, done)
    async (req, accessToken, refreshTokenFromGoogle, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase?.();
        // fetch phone number (best effort)
        let phone = null;
        try {
          const resp = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const people = await resp.json();
          phone = people.phoneNumbers?.[0]?.value || null;
        } catch (err) {
          // ignore phone fetch failures
          console.error("Google People API phone fetch failed:", err?.message || err);
        }

        // build a base username
        let baseUsername =
          profile.displayName?.replace(/\s+/g, "").toLowerCase() ||
          (email ? email.split("@")[0] : `user${Date.now()}`);

        // ensure username uniqueness
        let username = baseUsername;
        let suffix = 1;
        let check = await db.query("SELECT id FROM users WHERE username = $1", [
          username,
        ]);
        while (check.rowCount) {
          username = `${baseUsername}${suffix}`;
          suffix++;
          check = await db.query("SELECT id FROM users WHERE username = $1", [
            username,
          ]);
        }

        // 1) check if social account already exists
        const providerId = profile.id;
        let user = null;
        const saRes = await db.query(
          `SELECT u.* FROM social_accounts sa
           JOIN users u ON sa.user_id = u.id
           WHERE sa.provider = $1 AND sa.provider_user_id = $2
           LIMIT 1`,
          ["google", providerId]
        );

        if (saRes.rowCount) {
          user = saRes.rows[0];
        } else if (email) {
          // 2) check if user exists by email (link account)
          const userByEmail = await db.query(
            "SELECT * FROM users WHERE email = $1 LIMIT 1",
            [email]
          );
          if (userByEmail.rowCount) {
            user = userByEmail.rows[0];
            // link social account (if not already linked)
            await db.query(
              `INSERT INTO social_accounts (user_id, provider, provider_user_id, provider_data)
               VALUES ($1,$2,$3,$4)
               ON CONFLICT (provider, provider_user_id) DO NOTHING`,
              [user.id, "google", providerId, JSON.stringify(profile)]
            );

            // optionally update provider column on users if it is 'local'
            if (!user.provider || user.provider === "local") {
              await db.query("UPDATE users SET provider = $1 WHERE id = $2", [
                "google",
                user.id,
              ]);
            }
          }
        }

        // 3) create a new user if none found
        if (!user) {
          const displayName = profile.displayName || `${username}`;
          const insertUser = await db.query(
            `INSERT INTO users (username, email, display_name, phone, provider, email_verified)
             VALUES ($1,$2,$3,$4,$5,$6)
             RETURNING *`,
            [username, email || null, displayName, phone || null, "google", true]
          );
          user = insertUser.rows[0];

          // insert social account
          await db.query(
            `INSERT INTO social_accounts (user_id, provider, provider_user_id, provider_data)
             VALUES ($1,$2,$3,$4)`,
            [user.id, "google", providerId, JSON.stringify(profile)]
          );
        }

        // At this point `user` is the application user object.
        // Create access token + refresh token & store hashed refresh in user_sessions
        const accessTokenApp = signAccessToken({
          sub: user.id,
          email: user.email,
          username: user.username,
        });

        const refreshToken = createRefreshToken();
        const refreshHash = hashRefreshToken(refreshToken);

        // decide remember / expiry — OAuth flow from UI didn't pass remember, default to persistent (30 days)
        const longDays = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30", 10);
        const expiresAt = refreshExpiresAt(longDays); // expected to return timestamp (same as used in login)

        await db.query(
          `INSERT INTO user_sessions (user_id, refresh_token_hash, ip, is_remember, device_info, expires_at)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            user.id,
            refreshHash,
            req.ip || null,
            true, // default persistent for OAuth - change if you prefer session cookie
            req.get("User-Agent") || null,
            expiresAt,
          ]
        );

        // return shape: include tokens so route/callback can set cookie
        return done(null, {
          user,
          accessToken: accessTokenApp,
          refreshToken,
          is_remember: true,
        });
      } catch (err) {
        console.error("Google strategy error:", err && err.message ? err.message : err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
