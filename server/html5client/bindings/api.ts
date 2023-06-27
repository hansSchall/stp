import { Router } from "express";
import { getDevTree } from "../../devCore/devCore";

export const r = Router();

r.get("/tree/full", (req, res) => {
    getDevTree().then(tree => res.json(tree));
});

