import express from 'express';
import {
  evaluateTransaction,
  submitTransaction,
} from '../controllers/transactions.js';
const router = express.Router();

router.route('/submit').post(submitTransaction);
router.route('/evaluate').post(evaluateTransaction);

export default router;
