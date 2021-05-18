import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import React, { FunctionComponent } from 'react';
import { Button, Spin } from 'antd';
import './index.less';
enum ConnectorNames {
  Injected = 'Injected',
}

const connectorsByName: { [connectorName: string]: any } = {
  [ConnectorNames.Injected]: injected,
};

const ConnectButton: FunctionComponent = () => {
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

  return (
    <div className="connect-container">
      <h5 style={{ margin: '1rem', textAlign: 'right' }}>
        {active ? '🟢' : error ? '🔴' : '🟠'}
      </h5>

      {Object.keys(connectorsByName).map((name) => {
        const currentConnector = connectorsByName['Injected'];
        const activating = currentConnector === activatingConnector;
        const connected = currentConnector === connector;
        const disabled = !!activatingConnector || connected || !!error;
        return !disabled ? (
          <div key={name}>
            <Button
              type="primary"
              disabled={disabled}
              onClick={() => {
                setActivatingConnector(currentConnector);
                activate(connectorsByName[name]);
              }}
            >
              Connect
            </Button>
          </div>
        ) : (
          <div key={name}>
            <span style={{ marginRight: '12px' }}>{account}</span>
            <Button
              type="primary"
              onClick={() => {
                deactivate();
              }}
            >
              Deactivate
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ConnectButton;
