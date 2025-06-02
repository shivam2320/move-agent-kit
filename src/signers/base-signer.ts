// src/signers/base-signer.ts

import type { SupraAccount, SupraClient } from "supra-l1-sdk"
import { type AnyRawTransaction, type HexString, TxnBuilderTypes } from "supra-l1-sdk-core"
import type { SignedTransactionResponse } from "../types"

export abstract class BaseSigner {
	protected constructor(
		protected readonly account: SupraAccount,
		protected readonly supra: SupraClient
	) {}

	public getAddress(): HexString {
		return this.account.address()
	}

	//  abstract getAccount(): Account;
	abstract signTransaction(transaction: AnyRawTransaction): Promise<SignedTransactionResponse>
	abstract sendTransaction(transaction: Uint8Array): Promise<HexString>
	abstract signMessage(message: HexString | string): Promise<HexString | string>
}
