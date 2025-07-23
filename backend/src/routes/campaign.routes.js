import express from 'express';
import { getCampaigns } from '../controller/campaing.controller.js';

const router = express.Router();

router.get('/campaigns', getCampaigns);

export default router;
