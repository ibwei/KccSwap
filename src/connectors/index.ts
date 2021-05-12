/** 
Web3Provider 旨在通过包装一个现有的 web3兼容(比如 Web3HttpProvider、 Web3IpcProvider 或 Web3WsProvider) ，并将其公开为 ethers.js 提供程序，从而简化从基于 web3.js 的应用程序到其他应用程序的转移。
*/
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from './NetworkConnector';

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL; // rpc 地址

export const NETWORK_CHAIN_ID: number = parseInt(
  process.env.REACT_APP_CHAIN_ID ? process.env.REACT_APP_CHAIN_ID : '321',
);

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(
    `REACT_APP_NETWORK_URL must be a defined environment variable`,
  );
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary = networkLibrary
    ? networkLibrary
    : new Web3Provider(network.provider as any));
}

// 添加支持的链
export const injected = new InjectedConnector({
  supportedChainIds: [321, 322],
});
