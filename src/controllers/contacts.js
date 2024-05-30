import createHttpError from 'http-errors';
import {
  createContacts,
  deleteStudent,
  getAllContacts,
  getContactsById,
  updateStudent,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactsById(contactId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: res.statusCode,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = await createContacts(req.body);

  res.status(201).json({
    status: res.statusCode,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const updateContact = await updateStudent(contactId, req.body, {
    upsert: true,
  });

  if (!updateContact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updateContact,
  });
};

export const deleteContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteStudent(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
