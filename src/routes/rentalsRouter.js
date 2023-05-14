import {Router} from 'express';
import { deleteRentals, finishRentals, getRentals, postRentals } from '../controllers/rentalsController.js';

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);
rentalsRouter.post("/rentals/:id/return", finishRentals);
rentalsRouter.delete("/rentals/:id", deleteRentals);

export default rentalsRouter;