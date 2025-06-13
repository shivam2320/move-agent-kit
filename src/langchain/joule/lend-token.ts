import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";
import { convertAmountFromHumanReadableToOnChain } from "../../utils/amount-conversion";

export class JouleLendTokenTool extends Tool {
  name = "joule_lend_token";
  description = `this tool can be used to lend SUPRA, tokens or fungible asset to a position

  if you want to lend SUPRA, mint will be "0x1::supra_coin::SupraCoin"
  if you want to lend token other than SUPRA, you need to provide the mint of that specific token
  if you want to lend fungible asset, add "0x1::supra_coin::SupraCoin" as mint and provide fungible asset address

  if positionId is not provided, the positionId will be 1234 and newPosition should be true
  
  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required)
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)
  positionId: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  newPosition: boolean, (required)  
  `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input);

      const fungibleAsset = parsedInput.mint.toLowerCase();

      const lendTokenTransactionHash = await this.agent.lendToken(
        convertAmountFromHumanReadableToOnChain(parsedInput.amount, 8),
        parsedInput.mint,
        parsedInput.positionId,
        parsedInput.newPosition,
        fungibleAsset
      );

      return JSON.stringify({
        status: "success",
        lendTokenTransactionHash,
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
