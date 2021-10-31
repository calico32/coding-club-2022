import nextConnect from 'next-connect';
import { requireSession, session } from '../../lib/auth';
import prisma from '../../lib/prisma';
import { ApiRequest, ApiResponse } from '../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler
  .use(session)
  .use(requireSession)
  .get(async (req, res) => {
    const user = await prisma.user.findFirst({ where: { id: req.session.userId } });

    if (!user) {
      req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      select: {
        createdAt: false,
        user: false,
        userId: false,
        transactions: false,
        balance: true,
        name: true,
        id: true,
        description: true,
      },
    });

    res.json({ accounts });
  });
