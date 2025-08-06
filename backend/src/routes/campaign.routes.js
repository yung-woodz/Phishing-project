import express from 'express';
import { getCampaigns } from '../controller/campaing.controller.js';
import { getCampaignDetails } from '../controller/campaignDetail.controller.js';

const router = express.Router();

router.get('/campaigns', getCampaigns);
router.get("/campaign/:campaignId/details", getCampaignDetails);

export default router;
