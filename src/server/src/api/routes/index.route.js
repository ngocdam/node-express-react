import express from 'express';
import APIResponse from '../helpers/APIResponse';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send(new APIResponse('OK'))
);

export default router;
