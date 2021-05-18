import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { injected } from '../../connectors';
import { Button } from 'antd';
import { utils } from 'ethers';
import './index.less';

enum ConnectorNames {
  Injected = 'Injected',
}

const connectorsByName: { [connectorName: string]: any } = {
  [ConnectorNames.Injected]: injected,
};

function ChainId() {
  const { chainId } = useWeb3React();

  return (
    <div>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId ? chainId : ''}</span>
    </div>
  );
}

function GasPrice() {
  const { library } = useWeb3React<Web3Provider>();

  const [price, setPrice] = React.useState<string | number>('');

  const getPirce = async () => {
    if (library) {
      const price = await library.getGasPrice();
      setPrice(utils.formatEther(price));
    }
  };

  return (
    <div>
      <span>price:{price}</span>
      <Button onClick={getPirce}>get Price</Button>
    </div>
  );
}

function BlockNumber() {
  const { chainId, library } = useWeb3React();

  const [blockNumber, setBlockNumber] = React.useState<number>();
  React.useEffect((): any => {
    if (!!library) {
      let stale = false;

      library
        .getBlockNumber()
        .then((blockNumber: number) => {
          if (!stale) {
            setBlockNumber(blockNumber);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(undefined);
          }
        });

      const updateBlockNumber = (blockNumber: number) => {
        setBlockNumber(blockNumber);
      };
      library.on('block', updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener('block', updateBlockNumber);
        setBlockNumber(undefined);
      };
    }
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <div>
      <span>Block Number</span>
      <span role="img" aria-label="numbers">
        🔢
      </span>
      <span>
        {blockNumber === null ? 'Error' : blockNumber ? blockNumber : ''}
      </span>
    </div>
  );
}

function Account() {
  const { account } = useWeb3React();

  return (
    <div>
      <span>Account</span>
      <span role="img" aria-label="robot">
        🤖
      </span>
      <span>
        {account === null
          ? '-'
          : account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4,
            )}`
          : ''}
      </span>
    </div>
  );
}

function Balance() {
  const { account, library, chainId } = useWeb3React<Web3Provider>();

  const [balance, setBalance] = React.useState();
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(undefined);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <div>
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>
        {balance === null
          ? 'Error'
          : balance
          ? `Ξ${formatEther(balance as any)}`
          : ''}
      </span>
    </div>
  );
}

function Info() {
  return (
    <div className="info-container">
      <ChainId />
      <BlockNumber />
      <Account />
      <Balance />
    </div>
  );
}

function CallContract() {
  const { library } = useWeb3React<Web3Provider>();

  // const  contract = new ethers.Contract()

  const [price, setPrice] = React.useState<string | number>('');

  const getPirce = async () => {};

  return (
    <div>
      <span>{price}</span>
      <Button onClick={getPirce}>call contract</Button>
    </div>
  );
}

const SwapPage = () => {
  return <Info />;
};
export default SwapPage;
