require('dotenv').config();
const express = require("express");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const todoapiRoute = require("./routes/apiRoutes");
const authapiRoute = require("./Auth/Authentication");
const empRoute = require("./routes/empRoutes");
app.use("/api", todoapiRoute)
app.use("/api", authapiRoute)
app.use("/api", empRoute)


db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on: http://localhost:${PORT}`);
  });
});
