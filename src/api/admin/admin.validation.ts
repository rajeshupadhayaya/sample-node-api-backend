import * as Joi from "joi";
import * as expressJoiValidation from "express-joi-validation";

const validator = expressJoiValidation.createValidator({ passError: true });

const loginBodySchema = Joi.object({
  email: Joi.string().lowercase().trim().required(),
  password: Joi.string().trim().required(),
});

export const AdminValidation = {
  create: {
    bodyValidator: validator.body(loginBodySchema),
  },
  login: {
    bodyValidator: validator.body(loginBodySchema),
  },
};
