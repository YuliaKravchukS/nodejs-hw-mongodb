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

const router = Router();

router.use('/contacts/:contactId', validateMongoId('contactId'));

router.get(
  '/contacts',

  ctrlWrapper(getContactsController),
);
router.get(
  '/contacts/:contactId',

  ctrlWrapper(getContactsByIdController),
);
router.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/contacts/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactsController),
);
router.delete(
  '/contacts/:contactId',

  ctrlWrapper(deleteContactsController),
);

export default router;
