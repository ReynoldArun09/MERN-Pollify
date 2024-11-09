import { ErrorMessages, SuccessMessages } from "../constants";
import { Question } from "../models/question-model";
import { app } from "../server";
import request from "supertest";

jest.mock("../models/question-model");

describe("Create new vote question", () => {
  it("should create new vote", async () => {
    (Question.findOne as jest.Mock).mockResolvedValueOnce(null);
    const response = await request(app).post("/api/v1/question/new-vote").send({
      question: "This is test question?",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toBe(SuccessMessages.QUESTION_CREATE);
  });

  it("should return 400 status if question is already created", async () => {
    (Question.findOne as jest.Mock).mockResolvedValueOnce({});
    const response = await request(app).post("/api/v1/question/new-vote").send({
      question: "This is test question?",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toBe(ErrorMessages.QUESTION_ALREADY_EXISTS);
  });
});

describe("Get all questions", () => {
  it("should return array of questions", async () => {
    const mockQuestions = [
      {
        _id: "mockId",
        question: "mockquestion",
        yes: 0,
        no: 0,
      },
    ];
    (Question.find as jest.Mock).mockResolvedValueOnce(mockQuestions);
    const response = await request(app).get("/api/v1/question/get-votes");
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data).toStrictEqual(mockQuestions);
  });
});
