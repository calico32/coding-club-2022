import bcrypt from 'bcrypt';
import nextConnect from 'next-connect';
import { session } from '../../lib/auth';
import prisma from '../../lib/prisma';
import { ApiRequest, ApiResponse } from '../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler.use(session).post(async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    res.status(400).json({ message: 'Please provide a name, username and password.' });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: { name, username, password: await bcrypt.hash(password, 1024) },
    });

    req.session.userId = user.id;

    res.status(201).json({ user });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
