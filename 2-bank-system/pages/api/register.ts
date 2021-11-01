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

  // check if name is between 3 and 100 characters
  if (name.length < 3 || name.length > 100) {
    res.status(400).json({ message: 'Name must be between 3 and 100 characters.' });
    return;
  }

  // check username length between 3 and 16 characters
  if (username.length < 3 || username.length > 16) {
    res.status(400).json({ message: 'Username must be between 3 and 16 characters.' });
    return;
  }

  // check password at least 8 characters
  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters.' });
    return;
  }

  // check if username is taken
  const taken = await prisma.user.findFirst({ where: { username } });

  if (taken) {
    res.status(400).json({ message: 'Username is already taken.' });
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
