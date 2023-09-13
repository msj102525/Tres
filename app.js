require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const { globalErrorHandler } = require("./utils/error");
const dataSource = require("./models/dataSource");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(routes);
app.use(globalErrorHandler);

const port = process.env.PORT;

app.get("/ping", (req, res) => {
  res.json({ message: "pong!" });
});

const start = async () => {
  try {
    dataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.log("Error occured during Data Source initializtion!", err);
        dataSource.destroy();
      });
    app.listen(port, () => console.log(`Server is listening on ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
