const { Contact } = require("../models/contacts");

const HttpError = require("../helpers/HttpError");

async function getContactsService(req, res) {
  const contacts = await Contact.find({});
  res.json(contacts);
}

async function getContactService(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(new HttpError(404, "Contact is not found!"));
  }

  return res.json(contact);
}

async function createContactService(req, res, next) {
  const { name, email, phone, favorite } = req.body;
  const newContact = await Contact.create({ name, email, phone, favorite });

  res.status(201).json(newContact);
}

async function deleteContactService(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(new HttpError(404, "No found"));
  }

  await Contact.findByIdAndRemove(contactId);
  return res.status(200).json({ message: "Contact deleted" });
}

async function updateContactService(req, res, next) {
  if (!Object.keys(req.body).length) {
    return next(new HttpError(400, "Missing fields"));
  }

  const { contactId } = req.params;
  const updatedContact = await Contact.findOneAndUpdate(contactId, {});

  if (!updatedContact) {
    return next(new HttpError(404, "Contact not found"));
  }

  return res.status(200).json(updatedContact);
}

async function updateStatusContactService(req, res, next) {
  const keys = Object.keys(req.body);
  const contactWithUpdField = keys.filter((value) => value === "favorite");

  if (!contactWithUpdField) {
    return next(new HttpError(400, "Missing fields favorite"));
  }
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, {});

  if (!updatedContact) {
    return next(new HttpError(404, "Not found"));
  }

  return res.status(200).json(updatedContact);
}
module.exports = {
  updateContactService,
  deleteContactService,
  updateStatusContactService,
  createContactService,
  getContactService,
  getContactsService,
};
