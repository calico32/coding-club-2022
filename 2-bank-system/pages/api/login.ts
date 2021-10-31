import bcrypt from 'bcrypt';
import nextConnect from 'next-connect';
import { session } from '../../lib/auth';
import prisma from '../../lib/prisma';
import { ApiRequest, ApiResponse } from '../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler.use(session).post(async (req, res) => {
  if (req.session.userId) return res.status(400).json({ message: 'Already logged in' });

  const { username, password } = req.body;

  const invalid = {
    message: 'Invalid username or password',
  };

  try {
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) return res.status(403).json(invalid);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json(invalid);

    req.session.userId = user.id;

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});
