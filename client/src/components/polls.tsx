import { useEffect, useState } from "react";
import CreatePoll from "./create-poll";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, X } from "lucide-react";
import socket from "@/socket";
import { toast } from "sonner";
import { axiosInstance } from "@/axios";

export interface ResponseType {
  _id: string;
  no: number;
  yes: number;
  question: string;
}

export default function Polls() {
  const [votes, setVotes] = useState<ResponseType[]>([]);

  useEffect(() => {
    const fetchVotes = async () => {
      const response = await axiosInstance.get("/api/v1/question/get-votes");
      setVotes(response.data.data);
    };
    fetchVotes();
  }, []);

  useEffect(() => {
    socket.on("answer:output", handleAnswerOutput);

    return () => {
      socket.off("answer:output", handleAnswerOutput);
    };
  }, [votes]);

  const handleAnswerOutput = ({
    id,
    answer,
  }: {
    id: string;
    answer: number;
  }) => {
    setVotes((prevValues: ResponseType[]) =>
      prevValues.map((vote) =>
        vote._id === id
          ? {
              ...vote,
              yes: answer === 1 ? vote.yes + 1 : vote.yes,
              no: answer === 0 ? vote.no + 1 : vote.no,
            }
          : vote
      )
    );
  };
  const handleAnswerInput = (id: string, answer: number) => {
    socket.emit("answer:input", { id, answer });
    toast.success(
      `${answer === 0 ? "You have voted - No" : "You have voted - Yes"}`
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="py-3">
          <p className="text-gray-600 font-bold text-xl">
            {votes?.length || 0} poll found
          </p>
        </div>
        <CreatePoll />
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4 py-5">
        {votes?.map((cardData) => (
          <Card key={cardData._id}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold min-h-[100px]">
                {cardData.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="flex justify-between px-2 py-1 bg-green-400 rounded-sm cursor-pointer"
                onClick={() => handleAnswerInput(cardData._id, 1)}
              >
                <p className="flex items-center gap-2">
                  <Check />
                  <span>Yes</span>
                </p>
                <p>{cardData.yes}</p>
              </div>
              <div
                className="flex justify-between px-2 py-1 bg-red-400 rounded-sm cursor-pointer"
                onClick={() => handleAnswerInput(cardData._id, 0)}
              >
                <p className="flex items-center gap-2">
                  <X />
                  <span>No</span>
                </p>
                <p>{cardData.no}</p>
              </div>
            </CardContent>
            <CardContent>
              <h5 className="text-xl font-bold">Results:</h5>
              <div className="flex justify-between items-center py-2">
                <p>
                  Yes:{" "}
                  {cardData.yes + cardData.no === 0
                    ? 0
                    : Math.round(
                        (cardData.yes / (cardData.yes + cardData.no)) * 100
                      )}
                  %
                </p>
                <p>
                  No:{" "}
                  {cardData.yes + cardData.no === 0
                    ? 0
                    : Math.round(
                        (cardData.no / (cardData.yes + cardData.no)) * 100
                      )}
                  %
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
