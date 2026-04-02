import { env } from "../config/env.js";
import { Soil } from "../models/soil.model.js";
import { uploadBufferToDrive } from "../services/drive.service.js";

export const uploadImages = async (req, res, next) => {
  try {
    const files = req.files || [];

    if (files.length < 1) {
      return res.status(400).json({ message: "At least 1 image is required" });
    }

    if (files.length > env.maxUploadImages) {
      return res.status(400).json({
        message: `Maximum ${env.maxUploadImages} images are allowed`
      });
    }

    const urls = await Promise.all(files.map((file) => uploadBufferToDrive(file)));
    res.status(201).json({ images: urls });
  } catch (error) {
    next(error);
  }
};

export const saveData = async (req, res, next) => {
  try {
    const {
      refId,
      recordKey,
      sensorMode,
      location,
      soilType,
      remarks,
      temperature,
      humidity,
      npk,
      minValues,
      maxValues,
      latitude,
      longitude,
      images,
      timestamp
    } = req.body;

    if (!refId) {
      return res.status(400).json({ message: "refId is required" });
    }

    if (images && !Array.isArray(images)) {
      return res.status(400).json({ message: "images must be an array when provided" });
    }

    const normalizedRecordKey = recordKey || `${refId}-${Date.now()}`;

    const existing = await Soil.findOne({ refId });

    if (existing) {
      if (location) {
        existing.location = location;
      }
      if (soilType) {
        existing.soilType = soilType;
      }

      const targetRecord = existing.records.find((item) => item.recordKey === normalizedRecordKey);

      if (targetRecord) {
        if (temperature !== undefined) {
          targetRecord.temperature = temperature;
        }
        if (humidity !== undefined) {
          targetRecord.humidity = humidity;
        }
        if (npk) {
          targetRecord.npk = {
            ...(targetRecord.npk || {}),
            ...npk
          };
        }
        if (minValues) {
          targetRecord.minValues = {
            ...(targetRecord.minValues || {}),
            ...minValues
          };
        }
        if (maxValues) {
          targetRecord.maxValues = {
            ...(targetRecord.maxValues || {}),
            ...maxValues
          };
        }
        if (latitude !== undefined) {
          targetRecord.latitude = latitude;
        }
        if (longitude !== undefined) {
          targetRecord.longitude = longitude;
        }
        if (Array.isArray(images) && images.length) {
          targetRecord.images = [...new Set([...(targetRecord.images || []), ...images])];
        }
        if (remarks !== undefined) {
          targetRecord.remarks = remarks;
        }
        targetRecord.timestamp = timestamp ? new Date(timestamp) : new Date();
        if (sensorMode) {
          const modes = new Set([...(targetRecord.sensorModes || []), sensorMode]);
          targetRecord.sensorModes = [...modes];
        }

        await existing.save();
        return res.status(200).json({ message: "Record merged", data: existing });
      }

      existing.records.push({
        recordKey: normalizedRecordKey,
        temperature,
        humidity,
        npk,
        minValues,
        maxValues,
        latitude,
        longitude,
        images: images || [],
        sensorModes: sensorMode ? [sensorMode] : [],
        remarks,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      });

      await existing.save();
      return res.status(200).json({ message: "Record appended", data: existing });
    }

    const created = await Soil.create({
      refId,
      location,
      soilType,
      records: [
        {
          recordKey: normalizedRecordKey,
          temperature,
          humidity,
          npk,
          minValues,
          maxValues,
          latitude,
          longitude,
          images: images || [],
          sensorModes: sensorMode ? [sensorMode] : [],
          remarks,
          timestamp: timestamp ? new Date(timestamp) : new Date()
        }
      ]
    });

    res.status(201).json({ message: "New document created", data: created });
  } catch (error) {
    next(error);
  }
};

export const getHistoryByRefId = async (req, res, next) => {
  try {
    const { refId } = req.params;
    const data = await Soil.findOne({ refId }).lean();

    if (!data) {
      return res.status(404).json({ message: "No data found for refId" });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getHistoryByLocation = async (req, res, next) => {
  try {
    const { location } = req.params;
    const data = await Soil.find({
      location: { $regex: new RegExp(`^${location}$`, "i") }
    }).lean();

    if (!data.length) {
      return res.status(404).json({ message: "No data found for location" });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
