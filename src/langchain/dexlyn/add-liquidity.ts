import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";
import { getTokenByTokenName } from "../../utils/get-pool-address-by-token-name";
import { convertAmountFromHumanReadableToOnChain } from "../../utils/amount-conversion";

export class DexlynAddLiquidityTool extends Tool {
  name = "Dexlyn_add_liquidity";
  description = `this tool can be used to add liquidity in Dexlyn

    if you want to add SUPRA and one of the token, mint will be "0x1::supra_coin::SupraCoin"

	if user added mintX or mintY as asset name, and you don't have the address of the asset, you can use the following token names:
	['usdt', 'zusdt', 'zusdc', 'apt', 'sthapt', 'mod', 'thl', 'wusdc' , 'zweth', 'wweth', 'cake', 'stapt', 'abtc', 'stone' , 'truapt', 'sbtc']
	or whatever name the user has provided, you can use the token name to get the address of the token 


    Inputs ( input is a JSON string ):
    mintX: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" or "usdt (name of the token)" (required)
    mintY: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" or "usdt (name of the token)" (required)
    mintXAmount: number, eg 1 or 0.01 (required)
    mintYAmount: number, eg 1 or 0.01 (required)
  `;

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

      const swapTransactionHash = await this.agent.addLiquidity(
        mintX,
        mintY,
        convertAmountFromHumanReadableToOnChain(
          parsedInput.mintXAmount,
          mintXDecimals
        ),
        convertAmountFromHumanReadableToOnChain(
          parsedInput.mintYAmount,
          mintYDecimals
        )
      );

      return JSON.stringify({
        status: "success",
        swapTransactionHash,
        token: [
          {
            mintX,
            decimals: mintXDecimals,
          },
          {
            mintY,
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
