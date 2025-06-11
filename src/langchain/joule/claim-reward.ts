import { Tool } from "langchain/tools";
import type { AgentRuntime } from "../../agent";
import { parseJson } from "../../utils";

export class JouleClaimRewardTool extends Tool {
  name = "joule_claim_rewards";
  description = `this tool can be used to claim rewards from Joule pools

    Supports claiming both SUPRA incentives and stSUPRA incentives.

    User can only claim rewards for coin - 
    usdt - 0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b
    usdc - 0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b
    weth - 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa

    Inputs (input is a JSON string):
    rewardCoinType: string, eg "0x1::supra_coin::SupraCoin" (required)
  `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input);

      const claimRewardsTransactionHash = await this.agent.claimReward(
        parsedInput.rewardCoinType
      );

      return JSON.stringify({
        status: "success",
        claimRewardsTransactionHash,
        reward: parsedInput.rewardCoinType,
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
