import express from 'express';
import {
  registerAndEnroll,
  reEnroll,
  revoke,
} from '../controllers/identity.js';

const router = express.Router();

router.route('/registerAndEnroll').post(registerAndEnroll);
router.route('/reEnroll').post(reEnroll);
router.route('/revoke').post(revoke);

export default router;
