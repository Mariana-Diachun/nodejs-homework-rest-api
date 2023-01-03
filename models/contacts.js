const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const dbPath = path.resolve(__dirname, "./contacts.json");

async function readDb() {
  const dbRaw = await fs.readFile(dbPath);
  const db = JSON.parse(dbRaw);
  return db;
}

async function writeDb(db) {
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
  await writeDb(updatedDb);
}

async function addContact(name, email, phone) {
  const id = nanoid();
  const contact = { id, name, email, phone };
  const db = await readDb();
  db.push(contact);
  await writeDb(db);
  return contact;
}

async function updateContact(contactId, body) {
  const db = await readDb();
  const contact = db.find((contact) => contact.id === contactId);
  if (!contact) {
    return null;
  }
  const updatedContact = { ...contact, ...body };
  const index = db.findIndex((el) => el.id === contactId);
  db.splice(index, 1, updatedContact);
  await writeDb(db);
  return updatedContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
