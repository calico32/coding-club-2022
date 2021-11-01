import nextConnect from 'next-connect';
import { requireSession, session } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { ApiRequest, ApiResponse } from '../../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler
  .use(session)
  .use(requireSession)
  .get(async (req, res) => {
    const { accountId } = req.query;

    const user = await prisma.user.findFirst({ where: { id: req.session.userId } });

    if (!user) {
      await req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // get account
    const account = await prisma.account.findFirst({
      where: { id: accountId.toString(), userId: user.id },
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // get transactions
    const transactions = await prisma.transaction.findMany({
      where: { accountId: account.id },
    });

    // sort by date, newest first
    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return res.status(200).json({ transactions: sortedTransactions });
  });
