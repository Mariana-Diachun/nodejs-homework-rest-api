const db = require("../models/contacts");

const { HttpError } = require("../helpers/index");

async function getContactsService(req, res) {
  const contacts = await db.listContacts();
  res.json(contacts);
}

async function getContactService(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(HttpError(404, "Contact is not found!"));
  }

  return res.json(contact);
}

async function createContactService(req, res, next) {
  const { name, email, phone } = req.body;
  const newContact = await db.addContact(name, email, phone);

  if (!newContact) {
    return next(HttpError(400, "missing required name field"));
  }

  res.status(201).json(newContact);
}

async function deleteContactService(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(HttpError(404, "No found"));
  }

  await db.removeContact(contactId);
  return res.status(200).json({ message: "Contact deleted" });
}

async function updateContactService(req, res, next) {
  if (!Object.keys(req.body).length) {
    return next(HttpError(400, "Missing fields"));
  }

  const { contactId } = req.params;
  const updatedContact = await db.updateContact(contactId, req.body);

  if (!updatedContact) {
    return next(HttpError(404, "Contact not found"));
  }

  return res.status(200).json(updatedContact);
}

module.exports = {
  updateContactService,
  deleteContactService,
  createContactService,
  getContactService,
  getContactsService,
};
