"use strict";
import { EntitySchema } from "typeorm";

const CampaignSchema = new EntitySchema({
  name: "Campaign", 
  tableName: "campaigns", 
  columns: {
    id: {
      type: "uuid", 
      primary: true,
      generated: "uuid",
    },
    campaignName: {
      type: "varchar",
      length: 255,
      nullable: false,
      name: "campaign_name",
    },
    pageUrl: {
      type: "text",
      nullable: false,
      name: "page_url", 
    },
    startTime: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP", 
      nullable: false,
      name: "start_time",
    },
    totalSent: {
      type: "integer",
      default: 0, 
      nullable: false,
      name: "total_sent",
    },
    clicked: {
      type: "integer",
      default: 0, 
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
      name: "created_at", 
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP", 
      nullable: false,
      name: "updated_at", 
    },
  },
  indices: [
    {
      name: "IDX_CAMPAIGN_ID",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_CAMPAIGN_NAME",
      columns: ["campaignName"],
    },
    // Podrías añadir más índices si planeas buscar frecuentemente por URL o fecha
    // {
    //   name: "IDX_CAMPAIGN_URL",
    //   columns: ["pageUrl"],
    // },
    // {
    //   name: "IDX_CAMPAIGN_START_TIME",
    //   columns: ["startTime"],
    // },
  ],
});

export default CampaignSchema;