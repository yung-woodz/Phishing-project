import express from 'express';
import { captureCredentials } from '../controller/capture.controller.js';

const router = express.Router();

router.post('/capture', captureCredentials);

export default router;
