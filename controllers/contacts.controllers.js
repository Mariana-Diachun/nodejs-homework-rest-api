const contactsService = require("../services/contactsService");

const HttpError = require("../helpers/HttpError");

async function getContacts(req, res, next) {
  try {
    const { limit = 20, page = 1, favorite } = req.query;

    const skip = (page - 1) * limit;
    const contacts = await contactsService.getContacts(skip, limit, favorite);

    res.json(contacts);
  } catch (error) {
    return next(new HttpError(400, error.message));
  }
}

async function getContact(req, res, next) {
  const { contactId } = req.params;

  try {
    const contact = await contactsService.getContact(contactId);
    return res.json(contact);
  } catch (error) {
    return next(new HttpError(404, "Contact is not found!"));
  }
}

async function createContact(req, res, next) {
  const { name, email, phone, favorite, owner } = req.body;

  try {
    const newContact = await contactsService.createContact({
      name,
      email,
      phone,
      favorite,
      owner,
    });
    return res.status(201).json(newContact);
  } catch (error) {
    return next(new HttpError(400, "Missing fields"));
  }
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  try {
    await contactsService.deleteContact(contactId);
    return res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    return next(new HttpError(404, "Not found"));
  }
}

async function updateContact(req, res, next) {
  if (!Object.keys(req.body).length) {
    return next(new HttpError(400, "Missing fields"));
  }
  const { contactId } = req.params;
  try {
    const updatedContact = await contactsService.updateContact(
      contactId,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(updatedContact);
  } catch (error) {
    return next(new HttpError(404, "Contact not found"));
  }
}

async function updateStatusContact(req, res, next) {
  const keys = Object.keys(req.body);
  const contactWithUpdField = keys.find((value) => value === "favorite");

  if (!contactWithUpdField) {
    return next(new HttpError(400, "Missing fields favorite"));
  }

  const { contactId } = req.params;
  try {
    const updatedContact = await contactsService.updateContact(
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
  updateContact,
  deleteContact,
  updateStatusContact,
  createContact,
  getContact,
  getContacts,
};
