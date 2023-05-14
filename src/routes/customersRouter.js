import {Router} from 'express';
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from '../controllers/customersController.js';
import { customerSchema } from '../schemas/customersSchema.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(customerSchema), postCustomer);
customersRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomer);

export default customersRouter;