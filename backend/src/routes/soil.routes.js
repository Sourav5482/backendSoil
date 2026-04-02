import express from "express";
import multer from "multer";
import {
  getHistoryByLocation,
  getHistoryByRefId,
  saveData,
  uploadImages
} from "../controllers/soil.controller.js";
import { env } from "../config/env.js";

const upload = multer({ storage: multer.memoryStorage() });

export const soilRouter = express.Router();

soilRouter.post(
  "/upload-images",
  upload.array("images", env.maxUploadImages),
  uploadImages
);
soilRouter.post("/save-data", saveData);
soilRouter.get("/history/ref/:refId", getHistoryByRefId);
soilRouter.get("/history/location/:location", getHistoryByLocation);
