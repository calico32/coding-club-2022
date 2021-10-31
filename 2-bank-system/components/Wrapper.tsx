import { HTMLDivProps } from '@blueprintjs/core';
import React from 'react';

interface WrapperProps extends HTMLDivProps {
  width?: '800px' | '1024px';
}

const Wrapper: React.FC<WrapperProps> = ({ width = '800px', children, className }) => {
  return (
    <div
      className={`${width === '800px' ? 'max-w-[800px]' : 'max-w-[1024px]'} mx-auto ${className}`}
    >
      <div className="mx-4">{children}</div>
    </div>
  );
};

export default Wrapper;
