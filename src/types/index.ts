import type { TxnBuilderTypes } from "supra-l1-sdk";

export type ToolsNameList =
  | "supra_balance"
  | "supra_get_wallet_address"
  | "supra_transfer_token"
  | "supra_burn_token"
  | "supra_get_transaction"
  | "supra_token_details"
  | "supra_mint_token"
  | "supra_create_token"
  | "joule_lend_token"
  | "joule_withdraw_token"
  | "joule_borrow_token"
  | "joule_repay_token"
  | "joule_get_pool_details"
  | "joule_get_user_position"
  | "joule_get_user_all_positions"
  | "Dexlyn_add_liquidity"
  | "Dexlyn_create_pool"
  | "Dexlyn_remove_liquidity"
  | "Dexlyn_swap"
  | "openai_create_image";

export type SignedTransactionResponse = {
  senderAuthenticator?: TxnBuilderTypes.AccountAuthenticatorEd25519;
  signature?: Uint8Array<ArrayBufferLike>;
};
