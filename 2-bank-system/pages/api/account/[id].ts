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

    const account = await prisma.account.findFirst({
      where: { id: id.toString(), userId: user.id },
    });

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({ account });
  })
  .patch(async (req, res) => {
    const user = await prisma.user.findFirst({ where: { id: req.session.userId } });

    if (!user) {
      req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;

    const { name, description } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }

    // make sure the account exists
    const account = await prisma.account.findFirst({
      where: { id: id!.toString(), userId: user.id },
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // update the account
    try {
      const updatedAccount = await prisma.account.update({
        where: { id: id!.toString() },
        data: { name, description },
      });

      res.status(200).json({ account: updatedAccount });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .put(async (req, res) => {
    const user = await prisma.user.findFirst({ where: { id: req.session.userId } });

    if (!user) {
      req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    const { description, amount } = req.body;

    // get the account
    const account = await prisma.account.findFirst({
      where: { id: id!.toString(), userId: user.id },
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // create transaction
    try {
      const transaction = await prisma.transaction.create({
        data: {
          accountId: account.id,
          description,
          amount,
        },
      });

      // calculate new balance
      const newBalance = account.balance + transaction.amount;

      // update account
      const updatedAccount = await prisma.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      res.status(200).json({ transaction, account: updatedAccount });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .delete(async (req, res) => {
    const user = await prisma.user.findFirst({ where: { id: req.session.userId } });

    if (!user) {
      req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // make sure the account exists
      const account = await prisma.account.findFirst({
        where: { id: req.query.id!.toString(), userId: user.id },
      });

      // return error if account does not exist
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      // delete the account
      await prisma.account.delete({ where: { id: req.query.id!.toString() } });

      // return success
      res.status(200).json({ account });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
