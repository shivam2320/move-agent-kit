import type { AccountAddress, Aptos, MoveStructId } from "@aptos-labs/ts-sdk";
import { AptosPriceServiceConnection } from "@pythnetwork/pyth-aptos-js";
import { priceFeed } from "./constants/price-feed";
import type { BaseSigner } from "./signers";
import {
  borrowToken,
  burnNFT,
  burnToken,
  claimReward,
  createToken,
  getBalance,
  getPoolDetails,
  getTokenDetails,
  getTokenPrice,
  getTransaction,
  getUserAllPositions,
  getUserPosition,
  lendToken,
  mintToken,
  repayToken,
  transferNFT,
  transferTokens,
  withdrawToken,
} from "./tools";
import { createImage } from "./tools/openai";
import {
  addLiquidity,
  createPool,
  removeLiquidity,
  swap,
} from "./tools/dexlyn";
import { getTokenByTokenName } from "./utils/get-pool-address-by-token-name";
import { HexString, SupraClient } from "supra-l1-sdk";

export class AgentRuntime {
  public account: BaseSigner;
  public supra: SupraClient;
  public config: any;

  constructor(account: BaseSigner, supra: SupraClient, config?: any) {
    this.account = account;
    this.supra = supra;
    this.config = config ? config : {};
  }

  async getPythData() {
    const connection = new AptosPriceServiceConnection(
      "https://hermes.pyth.network"
    );

    return await connection.getPriceFeedsUpdateData(priceFeed);
  }

  getBalance(mint?: string | MoveStructId) {
    return getBalance(this, mint);
  }

  getTokenDetails(token: string) {
    return getTokenDetails(token);
  }

  getTokenByTokenName(name: string) {
    return getTokenByTokenName(name);
  }

  getTokenPrice(query: string) {
    return getTokenPrice(query);
  }

  transferTokens(to: HexString, amount: number, mint: string) {
    return transferTokens(this, to, amount, mint);
  }

  getTransaction(hash: string) {
    return getTransaction(this, hash);
  }

  burnToken(amount: number, mint: string) {
    return burnToken(this, amount, mint);
  }

  createToken(
    name: string,
    symbol: string,
    iconURI: string,
    projectURI: string
  ) {
    return createToken(this, name, symbol, iconURI, projectURI);
  }

  mintToken(to: HexString, mint: string, amount: number) {
    return mintToken(this, to, mint, amount);
  }

  transferNFT(to: AccountAddress, mint: AccountAddress) {
    return transferNFT(this, to, mint);
  }

  burnNFT(mint: AccountAddress) {
    return burnNFT(this, mint);
  }

  lendToken(
    amount: number,
    mint: MoveStructId,
    positionId: string,
    newPosition: boolean,
    fungibleAsset: boolean
  ) {
    return lendToken(
      this,
      amount,
      mint,
      positionId,
      newPosition,
      fungibleAsset
    );
  }

  borrowToken(
    amount: number,
    mint: MoveStructId,
    positionId: string,
    fungibleAsset: boolean
  ) {
    return borrowToken(this, amount, mint, positionId, fungibleAsset);
  }

  withdrawToken(
    amount: number,
    mint: MoveStructId,
    positionId: string,
    fungibleAsset: boolean
  ) {
    return withdrawToken(this, amount, mint, positionId, fungibleAsset);
  }

  repayToken(
    amount: number,
    mint: MoveStructId,
    positionId: string,
    fungibleAsset: boolean
  ) {
    return repayToken(this, amount, mint, positionId, fungibleAsset);
  }

  getUserPosition(userAddress: AccountAddress, positionId: string) {
    return getUserPosition(this, userAddress, positionId);
  }

  getUserAllPositions(userAddress: AccountAddress) {
    return getUserAllPositions(this, userAddress);
  }
  getPoolDetails(mint: string) {
    return getPoolDetails(this, mint);
  }

  addLiquidity(
    mintX: MoveStructId,
    mintY: MoveStructId,
    mintXAmount: number,
    mintYAmount: number
  ) {
    return addLiquidity(this, mintX, mintY, mintXAmount, mintYAmount);
  }

  removeLiquidity(
    mintX: MoveStructId,
    mintY: MoveStructId,
    lpAmount: number,
    minMintX = 0,
    minMintY = 0
  ) {
    return removeLiquidity(this, mintX, mintY, lpAmount, minMintX, minMintY);
  }

  swap(
    mintX: MoveStructId,
    mintY: MoveStructId,
    swapAmount: number,
    minCoinOut?: number
  ) {
    return swap(this, mintX, mintY, swapAmount, minCoinOut);
  }

  createPool(mintX: MoveStructId, mintY: MoveStructId) {
    return createPool(this, mintX, mintY);
  }

  claimReward(rewardCoinType: MoveStructId | string) {
    return claimReward(this, rewardCoinType);
  }
}
