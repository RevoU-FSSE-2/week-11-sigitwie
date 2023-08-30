import express from "express";
import userRoutes from "./routes/UserRoutes";
import postRoutes from './routes/PostRoutes';
import commentRoutes from './routes/CommentRoute';
import friendshipsRoutes from './routes/FriendshipsRouter'
import { authenticationMiddleware } from './middlewares/AuthenticationMiddleware';
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const openApiPath = path.join(__dirname, "..", 'doc', 'openapi.yaml');
const file = fs.readFileSync(openApiPath, "utf8");
const swaggerDocument = yaml.parse(file);

app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/v1/api/user", userRoutes);
app.use('/v1/api/posts', authenticationMiddleware, postRoutes);
app.use('/v1/api/comments', authenticationMiddleware, commentRoutes);
app.use('/v1/api/friendships', authenticationMiddleware, friendshipsRoutes);


export default app;
