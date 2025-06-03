import type { BaseSigner } from "./signers";
import {
  borrowToken,
  burnNFT,
  burnToken,
  claimReward,
  createToken,
  getBalance,
  getPoolDetail,
  getTokenPrice,
  getTransaction,
  getAllUserPositions,
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

  async getSupraData(pair: string) {
    try {
      const apiKey = process.env.SUPRA_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Supra API key not set in environment variable SUPRA_API_KEY"
        );
      }
      const response = await fetch(
        `https://prod-kline-rest.supra.com/latest?trading_pair=${pair}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch price data: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.instruments || data.instruments.length === 0) {
        throw new Error(`No price data found for ${pair}`);
      }

      return data.instruments[0];
    } catch (error: any) {
      throw new Error(`Failed to get Supra price data: ${error.message}`);
    }
  }

  getBalance(mint?: string) {
    return getBalance(this, mint);
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

  transferNFT(to: HexString, mint: HexString) {
    return transferNFT(this, to, mint);
  }

  burnNFT(mint: HexString) {
    return burnNFT(this, mint);
  }

  lendToken(
    amount: number,
    mint: string,
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
    mint: string,
    positionId: string,
    fungibleAsset: boolean
  ) {
    return borrowToken(this, amount, mint, positionId, fungibleAsset);
  }

  withdrawToken(
    amount: number,
    mint: string,
    positionId: string,
    fungibleAsset: boolean
  ) {
    return withdrawToken(this, amount, mint, positionId, fungibleAsset);
  }

  repayToken(
    amount: number,
    mint: string,
    positionId: string,
    fungibleAsset: boolean
  ) {
    return repayToken(this, amount, mint, positionId, fungibleAsset);
  }

  getUserPosition(userAddress: HexString, positionId: string) {
    return getUserPosition(this, userAddress, positionId);
  }

  getUserAllPositions(userAddress: HexString) {
    return getAllUserPositions(this, userAddress);
  }
  getPoolDetails(mint: string) {
    return getPoolDetail(this, mint);
  }

  addLiquidity(
    mintX: string,
    mintY: string,
    mintXAmount: number,
    mintYAmount: number
  ) {
    return addLiquidity(this, mintX, mintY, mintXAmount, mintYAmount);
  }

  removeLiquidity(
    mintX: string,
    mintY: string,
    lpAmount: number,
    minMintX = 0,
    minMintY = 0
  ) {
    return removeLiquidity(this, mintX, mintY, lpAmount, minMintX, minMintY);
  }

  swap(mintX: string, mintY: string, swapAmount: number, minCoinOut?: number) {
    return swap(this, mintX, mintY, swapAmount, minCoinOut);
  }

  createPool(mintX: string, mintY: string) {
    return createPool(this, mintX, mintY);
  }

  claimReward(rewardCoinType: string) {
    return claimReward(this, rewardCoinType);
  }
}
