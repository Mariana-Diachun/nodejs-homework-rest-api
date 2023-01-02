const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const dbPath = path.resolve(__dirname, "./contacts.json");

async function readDb() {
  const dbRaw = await fs.readFile(dbPath);
  const db = JSON.parse(dbRaw);
  return db;
}

async function writDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

async function listContacts() {
  const db = await readDb();
  return db;
}

async function getContactById(contactId) {
  const db = await readDb();
  const contact = db.find((contact) => contact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const db = await readDb();
  const updatedDb = db.filter((contact) => contact.id !== contactId);
  await writDb(updatedDb);
}

async function addContact(name, email, phone) {
  const id = nanoid();
  const contact = { id, name, email, phone };
  const db = await readDb();
  db.push(contact);
  await writDb(db);
  return contact;
}

async function updateContact(contactId, name, email, phone) {
  const updatedContact = { contactId, name, email, phone };
  const db = await readDb();
  if (!db.include(updatedContact)) {
    const updatedDb = db.push(updatedContact);
    return updatedDb;
  }
  return db;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
