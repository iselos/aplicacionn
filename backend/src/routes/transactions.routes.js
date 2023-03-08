import { Router } from "express";
import { getTransactions, getTransactionId, newTransaction } from '../controllers/transactions.controller';

const router = Router();

router.get('/', getTransactions);

router.get('/:id', getTransactionId);

router.post('/new', newTransaction);

module.exports = router;