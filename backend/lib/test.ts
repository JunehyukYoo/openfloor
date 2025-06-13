const testPool = require("./pool").default;
const testing = testPool.query("SELECT * FROM users");
import bcrypt from "bcryptjs";

// console.log("Testing connection to database...");
// testing
//   .then((res: any) => {
//     console.log("Database connection successful. Users:", res.rows);
//   })
//   .catch((err: any) => {
//     console.error("Database connection error:", err);
//   })
//   .finally(() => {
//     testPool.end();
//   });

console.log("Testing bcrypt...");
const password = "testPassword";
const hashedPassword = bcrypt.hashSync(password, 10);
console.log("Hashed password:", hashedPassword);
const isMatch = bcrypt.compareSync(password, hashedPassword);
console.log("Password match:", isMatch);
if (isMatch) {
  console.log("Password matches!");
} else {
  console.log("Password does not match.");
}
