const db = require("../models/contacts");

const { HttpError } = require("../helpers/index");

async function getContacts(req, res) {
  const contacts = await db.listContacts();
  res.json(contacts);
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(HttpError(404, "Contact is not found!"));
  }

  return res.json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone } = req.body;
  const newContact = await db.addContact(name, email, phone);

  if (!name || !email || !phone) {
    return next(HttpError(400, "missing required name field"));
  }

  res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await db.getContactById(contactId);

  if (!contact) {
    return next(HttpError(404, "No found"));
  }

  await db.removeContact(contactId);
  return res.status(200).json({ message: "Contact deleted" });
}

async function updateContact(req, res, next) {
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
  getContacts,
  updateContact,
  deleteContact,
  createContact,
  getContactById,
};
