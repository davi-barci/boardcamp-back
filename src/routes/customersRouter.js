import {Router} from 'express';
import { getCustomerById, getCustomers, postCustomer } from '../controllers/customersController.js';
import { customerSchema } from '../schemas/customersSchema.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(customerSchema), postCustomer);

export default customersRouter;