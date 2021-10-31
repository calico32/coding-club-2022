import nextConnect from 'next-connect';
import { session } from '../../lib/auth';
import prisma from '../../lib/prisma';
import { ApiRequest, ApiResponse } from '../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler.use(session).get(async (req, res) => {
  const { username } = req.query;
  if (Array.isArray(username)) return res.status(400).json({ error: 'username must be a string' });
  const taken = await prisma.user.findFirst({ where: { username: username } });
  res.status(200).json({ taken: !!taken });
});
