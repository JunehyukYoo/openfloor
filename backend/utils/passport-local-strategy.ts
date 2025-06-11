// passport-local-strategy.ts
// FOR TESTING PURPOSES ONLY
require("dotenv").config();
const { Pool } = require("pg");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const mockStrategyWithEncryption = new LocalStrategy(
  async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

const mockStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }

    if (user.password !== password) {
      return done(null, false, { message: "Incorrect password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export default mockStrategy;
