import { ERC20Asset } from '@burner-wallet/assets';
import { toBN } from 'web3-utils';
import CERC20ABI from './CERC20.json';

export default class CompoundAsset extends ERC20Asset {
  constructor(params: any) {
    super({ ...params, type: 'erc20', abi: CERC20ABI });
  }

  async getBalance(account: string) {
    const balance = await this.cTokenToAsset(await super.getBalance(account));
    return balance;
  }

  async cTokenToAsset(cTokens: string) {
    // @ts-ignore
    const cToken = this.getContract();
    const exchangeRate = await cToken.methods.exchangeRateCurrent().call();

    const base = toBN('10').pow(toBN('18'));
    const assetBalance = toBN(exchangeRate).mul(toBN(cTokens)).div(base).toString();

    return assetBalance;
  }

  async assetToCToken(assetVal: string) {
    // @ts-ignore
    const cToken = this.getContract();
    const exchangeRate = await cToken.methods.exchangeRateCurrent().call();
    const base = toBN('10').pow(toBN('18'));
    const ctokens = toBN(assetVal).div(toBN(exchangeRate)).mul(base).toString();
    return ctokens;
  }

  async getTx(txHash: string) {
    const tx = await super.getTx(txHash);

    if (tx) {
      tx.value = await this.cTokenToAsset(tx.value);
      tx.displayValue = this.getDisplayValue(tx.value);
    }

    return tx;
  }

  async _send({ from, to, value }: any) {
    // @ts-ignore
    return super._send({
      from,
      to,
      value: await this.assetToCToken(value),
    });
  }
}
