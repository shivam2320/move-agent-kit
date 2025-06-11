import type { AgentRuntime } from "../../agent";
import { BCS, TxnBuilderTypes } from "supra-l1-sdk-core";

/**
 * Claim rewards from Joule pool
 * @param agent MoveAgentKit instance
 * @param mint The coin type of the reward
 * @returns Transaction signature
 */
export async function claimReward(
  agent: AgentRuntime,
  mint: string
): Promise<string> {
  try {
    const coinReward = `${mint}1111`.replace("0x", "@");

    const isCoinTypeSTApt =
      mint ===
      "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::stapt_token::StakedApt";

    let transaction = await agent.supra.createSerializedRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x0dc694898dff98a1b0447e0992d0413e123ea80da1021d464a4fbaf0265870d8",
      "pool",
      "claim_rewards",
      [
        (isCoinTypeSTApt
          ? "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::amapt_token::AmnisApt"
          : "0x1::supra_coin::SupraCoin") as unknown as TxnBuilderTypes.TypeTag,
      ],
      [
        BCS.bcsSerializeStr(coinReward),
        BCS.bcsSerializeStr(
          isCoinTypeSTApt ? "amAPTIncentives" : "APTIncentives"
        ),
      ]
    );

    let txn = await agent.supra.sendTxUsingSerializedRawTransaction(
      (agent.account as any).account,
      transaction,
      {
        enableWaitForTransaction: true,
      }
    );

    if (!txn.result) {
      console.error(txn, "Claim rewards failed");
      throw new Error("Claim rewards failed");
    }

    return txn.txHash;
  } catch (error: any) {
    throw new Error(`Claim rewards failed: ${error.message}`);
  }
}
