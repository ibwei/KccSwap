import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import './index.less';
import ConnectButton from '../../components/Connect';

export interface HeaderLayoutProps {}

const HeaderLayout: React.FunctionComponent<HeaderLayoutProps> = () => {
  const { active, error } = useWeb3React<Web3Provider>();
  return (
    <div className="header-container">
      <div className="header-left-container">Swap</div>
      <div className="header-right-container">
        <div style={{ marginRight: '20px' }}>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default HeaderLayout;
