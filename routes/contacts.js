const express = require("express");
const { tryCatchWrapper } = require("../helpers/index");
const {
  updateContact,
  deleteContact,
  updateStatusContact,
  createContact,
  getContact,
  getContacts,
} = require("../controllers/contacts.controllers");

const { validateBody } = require("../middlewares/index");
const {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} = require("../middlewares/schemas");

const contactsRouter = express.Router();

contactsRouter.get("/", tryCatchWrapper(getContacts));

contactsRouter.get("/:contactId", tryCatchWrapper(getContact));

contactsRouter.post(
  "/",
  validateBody(addContactSchema),
  tryCatchWrapper(createContact)
);

contactsRouter.delete("/:contactId", tryCatchWrapper(deleteContact));

contactsRouter.put(
  "/:contactId",
  validateBody(updateContactSchema),
  tryCatchWrapper(updateContact)
);

contactsRouter.patch(
  "/:contactId/favorite",
  validateBody(updateStatusContactSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = { contactsRouter };
