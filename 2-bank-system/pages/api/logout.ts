import nextConnect from 'next-connect';
import { requireSession, session } from '../../lib/auth';
import { ApiRequest, ApiResponse } from '../../lib/types';

const handler = nextConnect<ApiRequest, ApiResponse>();

export default handler
  .use(session)
  .use(requireSession)
  .post(async (req, res) => {
    await req.session.destroy();
    res.status(204).end();
  });
