import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { injected } from '../../connectors';
import { notification, Spin, Button } from 'antd';
import { getErrorMessage } from '../../components/Web3ReactManager';
import { utils } from 'ethers';

enum ConnectorNames {
  Injected = 'Injected',
}

const connectorsByName: { [connectorName: string]: any } = {
  [ConnectorNames.Injected]: injected,
};

function ChainId() {
  const { chainId } = useWeb3React();

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId ? chainId : ''}</span>
    </>
  );
}

function GasPrice() {
  const { library } = useWeb3React<Web3Provider>();

  const [price, setPrice] = React.useState<string | number>('loading');

  const getPirce = async () => {
    if (library) {
      const price = await library.getGasPrice();
      console.log(price);
    }
  };

  return (
    <>
      <span>price:{price}</span>
      <Button onClick={getPirce}>get Price</Button>
    </>
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
    <>
      <span>Block Number</span>
      <span role="img" aria-label="numbers">
        🔢
      </span>
      <span>
        {blockNumber === null ? 'Error' : blockNumber ? blockNumber : ''}
      </span>
    </>
  );
}

function Account() {
  const { account } = useWeb3React();

  return (
    <>
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
    </>
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
    <>
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
    </>
  );
}

function Header() {
  const { active, error } = useWeb3React();

  return (
    <>
      <h1 style={{ margin: '1rem', textAlign: 'right' }}>
        {active ? '🟢' : error ? '🔴' : '🟠'}
      </h1>
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr min-content 1fr',
          maxWidth: '20rem',
          lineHeight: '2rem',
          margin: 'auto',
        }}
      >
        <GasPrice />
        <ChainId />
        <BlockNumber />
        <Account />
        <Balance />
      </h3>
    </>
  );
}

function Test() {
  const context = useWeb3React<Web3Provider>();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already

  React.useEffect(() => {
    if (error) {
      const args = {
        message: '错误提示',
        description: getErrorMessage(error as any),
        duration: 0,
      };
      notification.open(args);
    }
  }, [error]);

  return (
    <>
      <Header />
      <hr style={{ margin: '2rem' }} />
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '20rem',
          margin: 'auto',
        }}
      >
        {Object.keys(connectorsByName).map((name) => {
          const currentConnector = connectorsByName['Injected'];
          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          const disabled = !!activatingConnector || connected || !!error;
          return (
            <Button
              type="primary"
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector);
                activate(connectorsByName[name]);
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem',
                }}
              >
                {activating && <Spin tip="loading"></Spin>}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </Button>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {(active || error) && (
          <Button
            onClick={() => {
              deactivate();
            }}
          >
            Deactivate
          </Button>
        )}

        {!!error && (
          <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>

      <hr style={{ margin: '2rem' }} />

      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'fit-content',
          maxWidth: '20rem',
          margin: 'auto',
        }}
      >
        {!!(library && account) && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              library
                .getSigner(account)
                .signMessage('👋')
                .then((signature: any) => {
                  window.alert(`Success!\n\n${signature}`);
                })
                .catch((error: any) => {
                  window.alert(
                    'Failure!' +
                      (error && error.message ? `\n\n${error.message}` : ''),
                  );
                });
            }}
          >
            Sign Message
          </button>
        )}
      </div>
    </>
  );
}

const SwapPage = () => {
  return <Test />;
};
export default SwapPage;
