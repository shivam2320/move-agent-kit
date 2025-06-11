import type { AgentRuntime } from "../../agent";
import { BCS, HexString } from "supra-l1-sdk-core";

/**
 * Get all user positions in joule
 * @param agent MoveAgentKit instance
 * @returns All user positions data
 */
export async function getAllUserPositions(
  agent: AgentRuntime,
  userAddress: HexString
): Promise<any> {
  try {
    let txn = await agent.supra.invokeViewMethod(
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8::pool::get_all_user_positions",
      [],
      [userAddress.toString()]
    );

    if (!txn.result) {
      console.error(txn, "Get all user positions failed");
      throw new Error("Get all user positions failed");
    }

    return txn.result;
  } catch (error: any) {
    throw new Error(`Get all user positions failed: ${error.message}`);
  }
}
