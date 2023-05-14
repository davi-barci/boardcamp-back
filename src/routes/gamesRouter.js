import {Router} from 'express';
import { getGames, postGame } from '../controllers/gamesController.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import { gameSchema } from '../schemas/gamesSchema.js';

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gameSchema), postGame);

export default gamesRouter;