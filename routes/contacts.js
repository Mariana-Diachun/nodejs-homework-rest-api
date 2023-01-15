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

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContact));

router.post(
  "/",
  validateBody(addContactSchema),
  tryCatchWrapper(createContact)
);

router.delete("/:contactId", tryCatchWrapper(deleteContact));

router.put(
  "/:contactId",
  validateBody(updateContactSchema),
  tryCatchWrapper(updateContact)
);

router.patch(
  "/:contactId/favorite",
  validateBody(updateStatusContactSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = router;
