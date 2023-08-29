import express from "express";
import userRoutes from "./routes/UserRoutes";

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);

export default app;
