import { convertAmountFromHumanReadableToOnChain } from "@aptos-labs/ts-sdk";
import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";

export class JouleRepayTokenTool extends Tool {
  name = "joule_repay_token";
  description = `this tool can be used to repay SUPRA, tokens or fungible asset from a position

  if you want to repay SUPRA, mint will be "0x1::supra_coin::SupraCoin"
  if you want to repay token other than SUPRA, you need to provide the mint of that specific token
  if you want to repay fungible asset, add "0x1::supra_coin::SupraCoin" as mint and provide fungible asset address
  
  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required)
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)
  positionId: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  fungibleAssetAddress: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (optional)
  `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input);

      const repayTokenTransactionHash = await this.agent.repayToken(
        convertAmountFromHumanReadableToOnChain(parsedInput.amount, 8),
        parsedInput.mint,
        parsedInput.positionId,
        parsedInput.fungibleAssetAddress
      );

      return JSON.stringify({
        status: "success",
        repayTokenTransactionHash,
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
