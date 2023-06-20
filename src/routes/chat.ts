import { Router } from "express";
import Chat from "./../entities/Chat";

const router = Router();

//TODO: Auth
router.get("/", async (req, res) => {
  const { user_id, chat_id } = req.query || {};

  const chats = await Chat.findAll({
    where: {
      id: chat_id,
      user_id: user_id,
    },
  });

  return res.json(chats);
});

export default router;
