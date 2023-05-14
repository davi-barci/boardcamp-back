import Joi from "joi";
import JoiDate from "@joi/date";

const joi = Joi.extend(JoiDate);

export const customerSchema = joi.object({
    name: joi.string().required().trim().min(1),
    phone: joi.string().required().pattern(/^[0-9]{10,11}$/),
    cpf: joi.string().required().pattern(/^[0-9]{11}$/),
    birthday: joi.date().format("YYYY-MM-DD").required(),
});
