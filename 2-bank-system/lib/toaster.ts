import { Toaster } from '@blueprintjs/core';
import { createContext, RefObject, useContext } from 'react';

export const ToasterContext = createContext<RefObject<Toaster>>(undefined!);

export const useToaster = () => {
  const toaster = useContext(ToasterContext);
  return toaster.current!;
};
