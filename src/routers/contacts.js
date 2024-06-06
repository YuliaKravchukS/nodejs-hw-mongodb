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

const router = Router();

router.get(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(getContactsController),
);
router.get(
  '/contacts/:contactId',
  validateBody(createContactSchema),
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
  validateBody(createContactSchema),
  ctrlWrapper(deleteContactsController),
);

export default router;
