import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  // const [contactsCount, contacts] = await Promise.all([
  //   ContactsCollection.find().merge(contactsQuery).countDocuments(),
  //   contactsQuery
  //     .skip(skip)
  //     .limit(limit)
  //     .sort({ [sortBy]: sortOrder })
  //     .exec(),
  // ]);
  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  return {
    data: contacts,
    ...paginationData,
  };
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
