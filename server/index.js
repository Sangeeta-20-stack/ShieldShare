const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const connectDB = require("./config/db");
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/files", require("./routes/file.routes"));
//app.use("/api/files", require("./routes/fileRoutes"));


app.get("/", (req, res) => {
  res.send("ShieldShare Backend Running");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
