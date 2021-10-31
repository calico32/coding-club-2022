import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-session/lib/types';
import type { ReactChild, ReactPortal } from 'react';

export type ReactNode =
  | ReactChild
  | ReadonlyArray<ReactNode>
  | ReactPortal
  | boolean
  | null
  | undefined;

export type WithChildren<T = {}> = T & { children?: ReactNode };

export interface CustomSession extends Session {
  userId: string;
}

export interface ApiRequest extends NextApiRequest {
  session: CustomSession;
}

export interface ApiResponse extends NextApiResponse {}
