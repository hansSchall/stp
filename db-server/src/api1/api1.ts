import { Router } from "express";
import { tv } from "./trackView";

export const api = Router();

api.use("/trackView", tv);

