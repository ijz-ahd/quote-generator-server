import "reflect-metadata";
import { createConnection } from "typeorm";
import cookieParser = require("cookie-parser");
import express = require("express");
import authRoute from "./routes/auth";
import favoriteRoute from "./routes/favorites";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api/auth", authRoute);
app.use("/api/favorites", favoriteRoute);

app.get("/", (_: express.Request, res: express.Response) =>
  res.send("Hello, World!")
);

app.listen(PORT, async () => {
  try {
    await createConnection({
      type: "postgres",
      ssl: {
        rejectUnauthorized: false,
      },
      url: "postgres://ftiwypnzmkfkld:4d062fda27ceb585b3b1082027d04126f636c2e05490cca6e99c9bba6ae640ee@ec2-52-45-183-77.compute-1.amazonaws.com:5432/ddu2q8mekqva16",
    });
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.log(err);
    return;
  }
});
