// uploadRouter.ts
import "dotenv/config";
import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import prisma from "../lib/prisma"; // your prisma client

const uploadRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const s3 = new AWS.S3();

uploadRouter.post("/avatar", upload.single("avatar"), async (req, res) => {
  const file = req.file;
  const userId = (req.user as any).id;
  console.log("In route /upload/avatar");
  if (!file || !userId) {
    res.status(400).json({ error: "Missing data" });
    return;
  }
  console.log("Received file.");

  const key = `profile-pictures/${userId}_${file.originalname}`;

  try {
    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    const publicUrl = `${process.env.S3_BUCKET_BASE_URL}/` + key;
    console.log("Put file at: " + publicUrl);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: publicUrl },
    });

    res.json({ profilePicture: publicUrl, user: updatedUser });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload" });
    return;
  }
});

export default uploadRouter;
