import React, { Suspense } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import AddLiquidity from './AddLiquidity';
import Swap from './Swap';
import Web3ReactManager from '../components/Web3ReactManager/index';
import './App.less';
import { getLibrary } from '../components/Web3ReactManager/index';
import { Web3ReactProvider } from '@web3-react/core';
import AppLayout from '../layouts/AppLayout';

// 获取当前时刻的状态

function App() {
  return (
    <div className="App">
      <Suspense fallback={<span>loading....</span>}>
        <HashRouter>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ReactManager getLibrary={getLibrary}>
              <AppLayout>
                <Switch>
                  <Route exact strict path="/swap" component={Swap} />
                  <Route
                    exact
                    strict
                    path="/addliquidity"
                    component={AddLiquidity}
                  />
                </Switch>
              </AppLayout>
            </Web3ReactManager>
          </Web3ReactProvider>
        </HashRouter>
      </Suspense>
    </div>
  );
}

export default App;
