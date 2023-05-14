import joi from "joi";

export const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().strict().integer().min(1).required(),
    pricePerDay: joi.number().strict().integer().min(1).required(),
});