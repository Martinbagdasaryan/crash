import { Router } from 'express';
import { authenticate, placeBet, settleWin, myBets } from '../controllers/user.controller';

const router = Router();

router.get('/bets/', myBets);
router.post('/Authenticate', authenticate);
router.post('/PlaceBet', placeBet);
router.post('/SettleWin', settleWin);

export default router;
