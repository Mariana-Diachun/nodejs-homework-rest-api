const { Contact } = require("../models/contacts");

async function getContacts() {
  return await Contact.find({});
}

async function getContact(contactId) {
  return await Contact.findById(contactId);
}

async function createContact(userData) {
  const { name, email, phone, favorite } = userData;
  return await Contact.create({ name, email, phone, favorite });
}

async function deleteContact(contactId) {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return "Not found";
  }
  await Contact.findByIdAndRemove(contactId);
}

async function updateContact(contactId, userData) {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, userData, {
    new: true,
  });
  return updatedContact;
}

module.exports = {
  getContacts,
  updateContact,
  deleteContact,
  getContact,
  createContact,
};
