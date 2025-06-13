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
export async function getBalance(
  agent: AgentRuntime,
  mint?: string
): Promise<number> {
  try {
    if (mint) {
      let balance: number;
      if (mint.split("::").length !== 3) {
        //     const balances = await agent.supra.getCurrentFungibleAssetBalances({
        //       options: {
        //         where: {
        //           owner_address: {
        //             _eq: agent.account.getAddress().toString(),
        //           },
        //           asset_type: { _eq: mint },
        //         },
        //       },
        //     });
        balance = 0;
      } else {
        balance = Number(
          await agent.supra.getAccountCoinBalance(
            agent.account.getAddress(),
            mint
          )
        );
      }
      return balance;
    }
    const balance = await agent.supra.getAccountSupraCoinBalance(
      agent.account.getAddress()
    );

    const convertedBalance = Number(balance) / 10 ** 8;

    return convertedBalance;
  } catch (error: any) {
    throw new Error(`Token balance failed: ${error.message}`);
  }
}
