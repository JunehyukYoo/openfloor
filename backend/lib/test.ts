const testPool = require("./pool").default;
const testing = testPool.query("SELECT * FROM users");
console.log("Testing connection to database...");
testing
  .then((res: any) => {
    console.log("Database connection successful. Users:", res.rows);
  })
  .catch((err: any) => {
    console.error("Database connection error:", err);
  })
  .finally(() => {
    testPool.end();
  });
