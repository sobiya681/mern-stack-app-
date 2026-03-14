const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 8080;

const EmployeeRouter = require("./Routes/EmployeeRoutes");
require("./Models/db");

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Employee Management server is running");
});

app.use("/api/employees", EmployeeRouter);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
