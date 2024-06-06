import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (contact) => {
  const newContact = await ContactsCollection.create(contact);
  return newContact;
};
export const updateContact = async (contactId, contact, options = {}) => {
  const updateContact = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
    },
    contact,
    {
      new: true,
      ...options,
    },
  );
  return updateContact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};
