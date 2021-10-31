import nextConnect from 'next-connect';
import { requireSession, session } from '../../lib/auth';
import prisma from '../../lib/prisma';
import { ApiRequest, ApiResponse } from '../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler
  .use(session)
  .get(async (req, res) => {
    const userId = req.session.userId;

    if (!userId) return res.json({ user: null });

    try {
      const user = await prisma.user.findFirst({ where: { id: userId } });

      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .use(requireSession)
  .put(async (req, res) => {
    const { userId } = req.session;
    const { name, username, password } = req.body;

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          username,
          password,
        },
      });

      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .delete(async (req, res) => {
    const { userId } = req.session;

    try {
      await prisma.user.delete({ where: { id: userId } });
      await req.session.destroy();
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
