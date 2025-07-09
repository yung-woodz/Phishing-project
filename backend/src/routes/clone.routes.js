import express from 'express';
import { clonePage } from '../controller/clone.controller.js';

const router = express.Router();

router.post('/clone', clonePage);

export default router;
