import nextConnect from 'next-connect';
import { requireSession, session } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { ApiRequest, ApiResponse } from '../../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler
  .use(session)
  .use(requireSession)
  .post(async (req, res) => {
    const { name, description } = req.body;

    const user = await prisma.user.findFirst({ where: { id: req.session.userId } });

    if (!user) {
      await req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // check if name is empty
    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    // check if name is 3 to 100 characters
    if (name.length < 3 || name.length > 100) {
      return res.status(400).json({ message: 'Name must be 3 to 100 characters.' });
    }

    // check if description is over 500 characters
    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description must be less than 500 characters.' });
    }

    try {
      // create new account
      const account = await prisma.account.create({
        data: {
          name,
          description,
          user: { connect: { id: user.id } },
        },
      });

      res.status(201).json({ account });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
