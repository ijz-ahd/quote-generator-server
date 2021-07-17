import { Request, Response, Router } from "express";
import { Favorite } from "../entity/Favorites";
import { User } from "../entity/User";
import auth from "../middlewares/auth";

const addFavorites = async (req: Request, res: Response) => {
  const { title, author } = req.body;
  const user: User = res.locals.user;

  try {
    if (title.trim() !== "" && author.trim() !== "") {
      const favorite = new Favorite({ title, author, user });
      await favorite.save();
      return res.json(favorite);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getFavorites = async (req: Request, res: Response) => {
  const user: User = res.locals.user;

  try {
    const favorites = await Favorite.find({ user });
    if (!favorites) {
      return res.json("No favorites");
    }
    return res.json(favorites);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const deleteFavorite = async (req: Request, res: Response) => {
  const quoteId: number = parseInt(req.params.id);

  try {
    const favorite = await Favorite.delete({ id: quoteId });
    if (!favorite) {
      return res.json("Favorite does not exist");
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const router = Router();
router.post("/add", auth, addFavorites);
router.delete("/delete/:id", auth, deleteFavorite);
router.get("/", auth, getFavorites);

export default router;
