import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middlewares/auth";

// register user
const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    // validate user
    const emailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });

    if (emailExist) errors.email = "Email already taken";
    if (usernameExist) errors.username = "Username already taken";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: errors });
    }

    // create user
    const user = new User({ email, username, password });
    errors = await validate(user);
    if (errors.length > 0) return res.status(400).json({ error: errors });

    await user.save();
    // return user
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

// login user
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    if (isEmpty(username)) errors.username = "Username cannot be empty";
    if (isEmpty(password)) errors.password = "Password cannot be empty";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const decodedPassword = await bcrypt.compare(password, user.password);
    if (!decodedPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 24,
        path: "/",
      })
    );

    return res.json({ user, token });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
};

// logout
const logout = (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );

  return res.json({ success: true });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", auth, logout);

export default router;
