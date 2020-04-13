import React from 'react';
import ReactDOM from 'react-dom';
// import { xdai, dai, eth } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, } from '@burner-wallet/core/gateways';
import Exchange from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
import CompoundAsset from '@burner-wallet/compound';

const cdai = new CompoundAsset({
  id: 'kcdai',
  name: 'Kovan cDai',
  address: '0xe7bc397dbd069fc7d0109c0636d06888bb50668c',
  network: '42',
});

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [cdai],
});

const exchange = new Exchange({
  pairs: [],
});

const BurnerWallet = () =>
  <ModernUI
    title="Basic Wallet"
    core={core}
    plugins={[exchange]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
