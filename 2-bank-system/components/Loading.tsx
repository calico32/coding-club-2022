import { Spinner, SpinnerSize } from '@blueprintjs/core';
import React from 'react';
import styles from '../styles/util.module.scss';
import Wrapper from './Wrapper';

interface LoadingProps {}

const Loading: React.VFC<LoadingProps> = ({}) => {
  return (
    <Wrapper className={`flex items-center justify-center ${styles.loading}`}>
      <Spinner size={SpinnerSize.LARGE} />
    </Wrapper>
  );
};

export default Loading;
