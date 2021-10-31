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
      req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    if (name.length > 100) {
      return res.status(400).json({ message: 'name is too long' });
    }

    if (description.length > 100) {
      return res.status(400).json({ message: 'description is too long' });
    }

    try {
      const account = await prisma.account.create({
        data: {
          name,
          description,
          user: { connect: user },
        },
      });

      res.status(201).json({ account });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
