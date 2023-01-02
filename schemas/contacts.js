const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .pattern(
      /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/,
      "For example Jacob Mercer!"
    )
    .messages({
      "any.required": "you should provide name!!",
    }),
  phone: Joi.string()
    .min(10)
    .max(10)
    .required()
    .pattern(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
      "For example Jacob Mercer!"
    )
    .messages({
      "any.required":
        "Name may contain only letters, apostrophe, dash and spaces.",
    }),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

module.exports = {
  addContactSchema,
};
