import { Request, Response } from "express";
import { Question } from "../models/question-model";
import { AsyncHandler } from "../utils";
import { ErrorMessages, HttpStatusCode, SuccessMessages } from "../constants";

export const CreateVote = AsyncHandler(async (req: Request, res: Response) => {
  const { question } = req.body;

  const existingQuestion = await Question.findOne({ question });

  if (existingQuestion) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      message: ErrorMessages.QUESTION_ALREADY_EXISTS,
    });
  }

  await Question.create({
    question,
  });

  res.status(HttpStatusCode.CREATED).json({
    success: true,
    message: SuccessMessages.QUESTION_CREATE,
  });
});

export const GetAllVotes = AsyncHandler(async (req: Request, res: Response) => {
  const questions = await Question.find({});

  res.status(HttpStatusCode.OK).json({
    success: true,
    data: questions,
  });
});
