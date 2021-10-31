import nextConnect from 'next-connect';
import { requireSession, session } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { ApiRequest, ApiResponse } from '../../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler
  .use(session)
  .use(requireSession)
  .get(async (req, res) => {
    const { id } = req.query;

    const user = await prisma.user.findFirst({ where: { id: req.session.userId } });

    if (!user) {
      req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id: id.toString(), account: { userId: user.id } },
    });

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ transaction });
  });
