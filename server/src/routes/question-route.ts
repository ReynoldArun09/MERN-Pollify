import { Router } from "express";
import * as votes from "../controllers/question-controller";
import { z } from "zod";
import { ValidationMiddleware } from "../middlewares/zod-middleware";

const VoteSchema = z.object({
  body: z.object({
    question: z.string().min(5),
  }),
});

const questionRoutes = Router();

questionRoutes.get("/get-votes", votes.GetAllVotes);
questionRoutes.post(
  "/new-vote",
  ValidationMiddleware(VoteSchema),
  votes.CreateVote
);

export default questionRoutes;
