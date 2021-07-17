import "reflect-metadata";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./routes/auth";
import favoriteRoute from "./routes/favorites";
import cors from "cors";
import User from "./entity/User";
import Favorite from "./entity/Favorites";

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
      entities: [User, Favorite],
    });
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.log(err);
    return;
  }
});
