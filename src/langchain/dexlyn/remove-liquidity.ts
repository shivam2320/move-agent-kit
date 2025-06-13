import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";
import { getTokenByTokenName } from "../../utils/get-pool-address-by-token-name";
import { parseFungibleAssetAddressToWrappedAssetAddress } from "../../utils/parse-fungible-asset-to-wrapped-asset";
import { convertAmountFromHumanReadableToOnChain } from "../../utils/amount-conversion";

export class DexlynRemoveLiquidityTool extends Tool {
  name = "Dexlyn_remove_liquidity";
  description = `this tool can be used to remove liquidity from Dexlyn

if you want to remove SUPRA and one of the token, mint will be "0x1::supra_coin::SupraCoin"

if user added mintX or mintY as asset name, and you don't have the address of the asset, use these token names:
usdt,zusdt,zusdc,apt,sthapt,mod,thl,wusdc,zweth,wweth,cake,stapt,abtc,stone,truapt,sbtc
or whatever name the user has provided, you can use the token name to get the address of the token 

minMintX and minMintY are minimum amount of tokens to receive, default is 0

deposit liquidity in one of the pools to get LP tokens if you don't have LP tokens

Inputs (input is a JSON string):
mintX: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" or "usdt (name of the token)" (required)
mintY: string, eg same as mintX (required)
lpAmount: number, eg 1 or 0.01 (required)
minMintX: number, eg 1 or 0.01 (optional)
minMintY: number, eg 1 or 0.01 (optional)`;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input);

      // Resolve token names to addresses
      let mintX = parsedInput.mintX;
      const tokenX = getTokenByTokenName(mintX);
      if (tokenX) {
        mintX = tokenX.tokenAddress;
      }

      let mintY = parsedInput.mintY;
      const tokenY = getTokenByTokenName(mintY);
      if (tokenY) {
        mintY = tokenY.tokenAddress;
      }

      const mintXDecimals = await this.agent.getTokenDecimals(mintX);
      const mintYDecimals = await this.agent.getTokenDecimals(mintY);

      const removeLiquidityTransactionHash = await this.agent.removeLiquidity(
        parseFungibleAssetAddressToWrappedAssetAddress(mintX),
        parseFungibleAssetAddressToWrappedAssetAddress(mintY),
        convertAmountFromHumanReadableToOnChain(parsedInput.lpAmount, 8),
        convertAmountFromHumanReadableToOnChain(
          parsedInput.minMintX || 0,
          mintXDecimals
        ),
        convertAmountFromHumanReadableToOnChain(
          parsedInput.minMintY || 0,
          mintYDecimals
        )
      );

      return JSON.stringify({
        status: "success",
        removeLiquidityTransactionHash,
        token: [
          {
            mintX: mintX,
            decimals: mintXDecimals,
          },
          {
            mintY: mintY,
            decimals: mintYDecimals,
          },
        ],
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
