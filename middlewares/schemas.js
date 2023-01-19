const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "any.required": "You should provide name",
  }),
  phone: Joi.string()
    .min(10)
    .max(15)
    .required()
    .pattern(
      /\(?([0-9]{3})\) \/?([0-9]{3})-?([0-9]{4})/,
      "For example (000) 000-0000"
    )
    .messages({
      "any.required": "You should provide phone number",
    }),
  email: Joi.string()
    .required()
    .messages({
      "any.required": "You should provide email",
    })
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),
  favorite: Joi.boolean().default(false),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).messages({
    "any.required": "You should provide name",
  }),
  phone: Joi.string()
    .max(15)
    .pattern(
      /\(?([0-9]{3})\) \/?([0-9]{3})-?([0-9]{4})/,
      "For example (000) 000-0000"
    )
    .messages({
      "any.required": "You should provide phone number",
    }),
  email: Joi.string()
    .messages({
      "any.required": "You should provide email",
    })
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),
  favorite: Joi.boolean(),
});

const updateStatusContactSchema = Joi.object({
  name: Joi.string().min(3),
  phone: Joi.string()
    .max(15)
    .pattern(
      /\(?([0-9]{3})\) \/?([0-9]{3})-?([0-9]{4})/,
      "For example (000) 000-0000"
    ),
  email: Joi.string()
    .messages({
      "any.required": "You should provide email",
    })
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),
  favorite: Joi.boolean().required(),
});

const strongPasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError = new Error(
  "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum 8 in length"
);

const addUserSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .regex(strongPasswordRegex)
    .error(stringPassswordError)
    .required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const findUserSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .regex(strongPasswordRegex)
    .error(stringPassswordError)
    .required(),
});

module.exports = {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
  addUserSchema,
  findUserSchema,
};
