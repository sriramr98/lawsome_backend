import { Router } from "express";
import Chat from "./../entities/Chat";
import authorizer from "./../middlewares/authorizer";

const router = Router();

//TODO: Auth
router.get("/", authorizer, async (req, res) => {
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
