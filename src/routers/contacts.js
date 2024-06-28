import { Router } from 'express';
import {
  createContactController,
  deleteContactsController,
  getContactsByIdController,
  getContactsController,
  patchContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const routerContacts = Router();

routerContacts.use('/:contactId', validateMongoId('contactId'));

routerContacts.use('/', authenticate);

routerContacts.get('', ctrlWrapper(getContactsController));

routerContacts.get('/:contactId', ctrlWrapper(getContactsByIdController));

routerContacts.post(
  '',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

routerContacts.patch(
  '/:contactId',
  upload.single('photo'),
  // validateBody(updateContactSchema),
  ctrlWrapper(patchContactsController),
);

routerContacts.delete('/:contactId', ctrlWrapper(deleteContactsController));

export default routerContacts;
