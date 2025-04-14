import express from "express";
import multer from "multer";
import { ChatController } from "../../../application/controllers/chatController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

export default (chatController: ChatController) => {
  router.get("/messages/:chatRoomId", chatController.getMessages.bind(chatController));
  router.post("/media", upload.single("file"), chatController.uploadMedia.bind(chatController));
  return router;
};