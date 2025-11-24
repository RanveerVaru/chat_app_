import express from "express";
import { signIn,signOut, signUp, getUser, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/sign-out", isAuthenticated, signOut);
router.get("/me",isAuthenticated, getUser);
router.put("/update-profile", isAuthenticated, updateProfile);

export default router;