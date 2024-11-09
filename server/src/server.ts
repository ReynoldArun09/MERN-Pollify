import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import { ParsedEnv } from "./config";
import MongoConnection from "./database/mongo-connection";
import questionRoutes from "./routes/question-route";
import { ErrorMiddleware } from "./middlewares/error-middleware";
import { logger } from "./utils";
import { Server, Socket } from "socket.io";
import { UpdateVote } from "./controllers/question-controller";

export const app = express();
const PORT = ParsedEnv.PORT;
app.use(helmet());
app.use(
  cors({
    origin: ParsedEnv.CORS_ORIGIN,
  })
);
app.use(express.json());

export const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket: Socket) => {
  socket.on("answer:input", async (data) => {
    const parsedData = JSON.parse(data);
    try {
      await UpdateVote(parsedData.id, parsedData.answer);
      socket.emit("answer:output", {
        id: parsedData.id,
        answer: parsedData.answer,
      });
    } catch (error) {
      console.log("error");
    }
  });
});

app.use("/api/v1/question", questionRoutes);
app.use(ErrorMiddleware);

MongoConnection();
server.listen(PORT, () => {
  logger.info(`[Server] up and running on ${PORT}`);
});
