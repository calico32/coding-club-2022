import type { IncomingMessage, NextFunction } from 'connect';
import { ServerResponse } from 'http';
import { Session } from 'next-session/lib/types';
import { ApiRequest, ApiResponse, CustomSession } from './types';

export const requireSession = (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    next();
  }
};

let _nextSession: (req: IncomingMessage, res: ServerResponse) => Promise<Session>;

const nextSession = () => {
  if (!_nextSession) {
    const RedisStoreFactory = require('connect-redis');
    const nextSessionFactory = require('next-session').default;
    const expressSession = require('next-session/lib/compat').expressSession;
    const promisifyStore = require('next-session/lib/compat').promisifyStore;
    const redis = require('redis');

    const RedisStore = RedisStoreFactory(expressSession as any);
    const redisClient = redis.createClient(process.env.REDIS_URL!);

    const store = new RedisStore({ client: redisClient });

    _nextSession = nextSessionFactory({
      cookie: {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      },
      name: '_next_session',
      store: promisifyStore(store),
      touchAfter: 60 * 60, // 1 hour
    });
  }

  return _nextSession;
};

export const getSession: (
  req: IncomingMessage & { session?: Session | undefined },
  res: ServerResponse
) => Promise<CustomSession> = nextSession() as any;

export const session = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  await nextSession()(req, res);
  next();
};
