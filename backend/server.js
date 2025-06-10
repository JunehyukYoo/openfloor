const cors = require("cors");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/test", (req, res) => {
  res.send("This was sent from the server.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
