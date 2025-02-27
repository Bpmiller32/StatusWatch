import { Router } from 'express';
import {
  getPingStatus,
  getPingList,
  getLogCheckStatus,
  getLogCheckList,
  getFullStatus
} from '../controllers/statusController';

const router = Router();

// Ping status routes
router.get('/pingstatus', getPingStatus);
router.get('/pinglist', getPingList);

// Log check status routes
router.get('/steadystatus', getLogCheckStatus);
router.get('/steadylist', getLogCheckList);

// Full status route
router.get('/fullstatus', getFullStatus);

export default router;
