import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactsById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContacts = async (contact) => {
  const newContact = await ContactsCollection.create(contact);
  return newContact;
};
export const updateStudent = async (contactId, contact, options = {}) => {
  const updateContact = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
    },
    contact,
  );
  return updateContact.value;
};

export const deleteStudent = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};
