import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";

export class SupraGetTokenDecimalsTool extends Tool {
  name = "supra_get_token_decimals";
  description = `Fetches the decimals of a token from supra blockchain

  Inputs ( input is a JSON string ):
  mint: string, eg "0x1::coin::SUPRA" (required)`;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input);

      const decimals = await this.agent.getTokenDecimals(parsedInput.mint);

      return JSON.stringify({
        status: "success",
        decimals,
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
