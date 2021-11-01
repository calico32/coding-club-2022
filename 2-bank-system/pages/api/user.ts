import bcrypt from 'bcrypt';
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
      const user = await prisma.user.findFirst({
        where: { id: userId },
        select: {
          password: false,
          name: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          accounts: {
            select: {
              id: true,
            },
          },
        },
      });

      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .use(requireSession)
  .patch(async (req, res) => {
    const { userId } = req.session;
    const { name, username, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      // invalid session
      await req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // check if name is between 3 and 100 characters
    if (name && (name.length < 3 || name.length > 100)) {
      return res.status(400).json({ message: 'Name must be between 3 and 100 characters' });
    }

    if (username && username !== user?.username) {
      // check username between 3 and 16 characters
      if (username.length < 3 || username.length > 16) {
        return res.status(400).json({ message: 'Username must be between 3 and 16 characters' });
      }

      // check if username is taken
      const taken = await prisma.user.findFirst({ where: { username } });

      if (taken) {
        return res.status(400).json({ message: 'Username taken' });
      }
    }

    if (newPassword) {
      // check new password min length
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }

      // check if current password is correct
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          username: username || user.username,
          password: newPassword ? await bcrypt.hash(newPassword, 1024) : user.password,
        },
      });

      res.json({ user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  .delete(async (req, res) => {
    const { userId } = req.session;

    try {
      // for each account, delete all transactions
      const accounts = await prisma.account.findMany({
        where: { userId },
        select: { id: true },
      });

      for (const account of accounts) {
        await prisma.transaction.deleteMany({ where: { accountId: account.id } });
      }

      // delete all associated accounts
      await prisma.account.deleteMany({ where: { userId } });

      // delete user
      await prisma.user.delete({ where: { id: userId } });
      await req.session.destroy();
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
