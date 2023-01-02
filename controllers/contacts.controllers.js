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

  //   const schema = Joi.object({
  //     name: Joi.string().min(2).required(),
  //     phone: number().min(10).max(10).required,
  //   });

  const newContact = db.addContact(name, email, phone);
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
  res.json({ message: "template message" });
}

module.exports = {
  getContacts,
  updateContact,
  deleteContact,
  createContact,
  getContactById,
};
