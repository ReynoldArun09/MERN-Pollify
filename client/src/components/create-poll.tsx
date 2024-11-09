import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "@/axios";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/v1/question/new-vote", {
        question,
      });
      if (response) {
        toast.success("New Poll Added.");
        window.location.reload();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="my-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            Create Poll <ArrowRight />{" "}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new poll</DialogTitle>
            <DialogDescription>
              Fill in the form to create a new poll
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Enter your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="px-3"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              <span className="sr-only">create</span>
              Create
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
