import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import { ParsedEnv } from "./config";
import MongoConnection from "./database/mongo-connection";
import questionRoutes from "./routes/question-route";
import { ErrorMiddleware } from "./middlewares/error-middleware";
import { logger } from "./utils";

export const app = express();
app.use(helmet());
app.use(
  cors({
    origin: ParsedEnv.CORS_ORIGIN,
  })
);
app.use(express.json());

export const server = http.createServer(app);

const PORT = ParsedEnv.PORT;

app.use("/api/v1/question", questionRoutes);

app.use(ErrorMiddleware);

MongoConnection();
server.listen(PORT, () => {
  logger.info(`[Server] up and running on ${PORT}`);
});
