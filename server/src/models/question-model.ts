import mongoose from "mongoose";

interface IQuestionSchema extends Document {
  question: string;
  yes: number;
  no: number;
}

const questionSchema = new mongoose.Schema<IQuestionSchema>({
  question: {
    type: String,
    required: true,
  },
  yes: {
    type: Number,
    default: 0,
  },
  no: {
    type: Number,
    default: 0,
  },
});

export const Question = mongoose.model<IQuestionSchema>(
  "Question",
  questionSchema
);
