import { convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk";
import type { AgentRuntime } from "../../agent";

/**
 * Fetches balance of an supra account
 * @param agent MoveAgentKit instance
 * @returns Transaction signature
 * @example
 * ```ts
 * const balance = await getBalance(agent)
 * ```
 */
export async function getTokenDecimals(
  agent: AgentRuntime,
  mint?: string
): Promise<number> {
  try {
    if (mint) {
      if (mint.split("::").length !== 3) {
        const decimals = await agent.supra.invokeViewMethod(
          "0x1::coin::decimals",
          [mint],
          []
        );
        return Number(decimals);
      } else {
        const decimals = await agent.supra.invokeViewMethod(
          "0x1::fungible_asset::decimals",
          [],
          [mint]
        );
        return Number(decimals);
      }
    }
    return 8;
  } catch (error: any) {
    throw new Error(`Token decimals failed: ${error.message}`);
  }
}
