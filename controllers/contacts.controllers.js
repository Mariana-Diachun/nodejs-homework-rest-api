const { Contact } = require("../models/contacts");

const HttpError = require("../helpers/HttpError");

async function getContactsService(req, res) {
  const contacts = await Contact.find({});
  res.json(contacts);
}

async function getContactService(req, res, next) {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    return res.json(contact);
  } catch (error) {
    return next(new HttpError(404, "Contact is not found!"));
  }
}

async function createContactService(req, res, next) {
  const { name, email, phone, favorite } = req.body;
  try {
    const newContact = await Contact.create({ name, email, phone, favorite });
    console.log(newContact);
    res.status(201).json(newContact);
  } catch (error) {
    console.log(error);
    return next(new HttpError(400, "Missing fields required"));
  }
}

async function deleteContactService(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(new HttpError(404, "Not found"));
  }

  await Contact.findByIdAndRemove(contactId);
  return res.status(200).json({ message: "Contact deleted" });
}

async function updateContactService(req, res, next) {
  if (!Object.keys(req.body).length) {
    return next(new HttpError(400, "Missing fields"));
  }

  const { contactId } = req.params;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      {
        new: true,
      }
    );
    console.log(updatedContact);
    return res.status(200).json(updatedContact);
  } catch (error) {
    return next(new HttpError(404, "Contact not found"));
  }
}

async function updateStatusContactService(req, res, next) {
  const keys = Object.keys(req.body);
  const contactWithUpdField = keys.find((value) => value === "favorite");

  if (!contactWithUpdField) {
    return next(new HttpError(400, "Missing fields favorite"));
  }

  const { contactId } = req.params;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(updatedContact);
  } catch (error) {
    return next(new HttpError(404, "Not found"));
  }
}

module.exports = {
  updateContactService,
  deleteContactService,
  updateStatusContactService,
  createContactService,
  getContactService,
  getContactsService,
};
