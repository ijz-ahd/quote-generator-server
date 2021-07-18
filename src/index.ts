import "reflect-metadata";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./routes/auth";
import favoriteRoute from "./routes/favorites";
import cors from "cors";
// import { User } from "./entity/User";
// import { Favorite } from "./entity/Favorite";
import { Client } from "pg";
require("dotenv").config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
    // await createConnection({
    //   type: "postgres",
    //   port: 5432,
    //   entities: [User, Favorite, __dirname + "/../**/**.entity{.ts,.js}"],
    //   url: process.env.DB_URL,
    //   host: "ec2-52-45-183-77.compute-1.amazonaws.com",
    //   username: "ftiwypnzmkfkld",
    //   password:
    //     "4d062fda27ceb585b3b1082027d04126f636c2e05490cca6e99c9bba6ae640ee",
    //   database: "ddu2q8mekqva16",
    //   extra: {
    //     ssl: true,
    //   },
    // });

    await createConnection();
    const client = new Client({
      connectionString: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    client.connect();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.log(err);
    return;
  }
});
