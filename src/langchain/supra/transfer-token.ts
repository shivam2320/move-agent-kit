import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";
import { convertAmountFromHumanReadableToOnChain } from "../../utils/amount-conversion";

export class SupraTransferTokenTool extends Tool {
  name = "supra_transfer_token";
  description = `This tool transfers SUPRA tokens, other tokens, or fungible assets on the Supra blockchain.

Transfer Types:
- SUPRA: Use mint "0x1::supra_coin::SupraCoin"
- Other tokens: Provide the specific token's mint address
- Fungible assets: Provide the fungible asset address as mint

Inputs (JSON string):
{
  "to": string (optional) - Recipient address or receiver address. If omitted or left blank, transfers to the caller's own address (self-transfer)
    Example: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa"
    
  "amount": number (required) - Amount to transfer
    Examples: 1, 0.01, 100.5
    
  "mint": string (required) - Token/asset identifier
    Examples:
    - SUPRA: "0x1::supra_coin::SupraCoin"
    - Other token: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT"
    - Fungible asset: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa"
}

Note: When "to" is not provided, the transfer will be made to your own address (useful for moving assets between your own accounts).`;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input);

      const recipient = this.agent.account.getAddress();

      const transferTokenTransactionHash = await this.agent.transferTokens(
        recipient,
        convertAmountFromHumanReadableToOnChain(parsedInput.amount, 8),
        parsedInput.mint
      );

      return JSON.stringify({
        status: "success",
        transferTokenTransactionHash,
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
