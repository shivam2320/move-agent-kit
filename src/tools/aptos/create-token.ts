import type { AgentRuntime } from "../../agent";
import { BCS } from "supra-l1-sdk";

/**
 * Create a fungible asset token
 * @param agent MoveAgentKit instance
 * @param name Name of the token
 * @param symbol Symbol of the token
 * @param iconURI URI of the token icon
 * @param projectURI URI of the token project
 */
export async function createToken(
  agent: AgentRuntime,
  name: string,
  symbol: string,
  iconURI: string,
  projectURI: string
): Promise<{
  hash: string;
  token: any;
}> {
  try {
    let transaction = await agent.supra.createRawTxObject(
      agent.account.getAddress(),
      (
        await agent.supra.getAccountInfo(agent.account.getAddress())
      ).sequence_number,
      "0x67c8564aee3799e9ac669553fdef3a3828d4626f24786b6a5642152fa09469dd",
      "launchpad",
      "create_fa_simple",
      [],
      [
        BCS.bcsSerializeStr(name),
        BCS.bcsSerializeStr(symbol),
        BCS.bcsSerializeStr(iconURI),
        BCS.bcsSerializeStr(projectURI),
      ]
    );

    let rawTransactionSerializer = new BCS.Serializer();
    transaction.serialize(rawTransactionSerializer);

    let txn = await agent.supra.sendTxUsingSerializedRawTransaction(
      (agent.account as any).account,
      rawTransactionSerializer.getBytes(),
      {
        enableWaitForTransaction: true,
      }
    );

    if (!txn.result) {
      console.error(txn, "Token burn failed");
      throw new Error("Token burn failed");
    }

    return {
      hash: txn.txHash,
      // @ts-ignore
      token: txn.events[0].data.fa_obj.inner,
    };
  } catch (error: any) {
    throw new Error(`Token creation failed: ${error.message}`);
  }
}
