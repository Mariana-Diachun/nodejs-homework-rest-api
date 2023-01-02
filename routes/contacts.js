const express = require("express");

const { tryCatchWrapper } = require("../helpers/index");

const {
  getContacts,
  updateContact,
  deleteContact,
  createContact,
  getContactById,
} = require("../controllers/contacts.controllers");
const { validateBody } = require("../middlewares/index");
const { addContactSchema } = require("../schemas/contacts");

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContactById));

router.post(
  "/",
  validateBody(addContactSchema),
  tryCatchWrapper(createContact)
);

router.delete("/:contactId", tryCatchWrapper(deleteContact));

router.put(
  "/:contactId",
  validateBody(addContactSchema),
  tryCatchWrapper(updateContact)
);

module.exports = { router };
