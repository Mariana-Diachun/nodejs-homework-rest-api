const { Contact } = require("../models/contacts");

async function getContacts(skip, limit, favorite) {
  const queryParams = {};
  if (favorite) {
    queryParams.favorite = favorite;
  }

  return await Contact.find(queryParams)
    .skip(skip)
    .limit(limit)
    .populate("owner");
}

async function getContact(contactId) {
  return await Contact.findById(contactId);
}

async function createContact(userData) {
  const { name, email, phone, favorite, owner } = userData;
  return await Contact.create({ name, email, phone, favorite, owner });
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
