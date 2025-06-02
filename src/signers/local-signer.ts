// src/signers/local-signer.ts

import { type HexString, type SupraAccount, SupraClient } from "supra-l1-sdk"
import type { TxnBuilderTypes } from "supra-l1-sdk-core"
import type { SignedTransactionResponse } from "../types"
import { BaseSigner } from "./base-signer"

export class LocalSigner extends BaseSigner {
	constructor(account: SupraAccount) {
		const supra = new SupraClient("https://rpc-autonet.supra.com/", 6)
		super(account, supra)
	}

	public getAddress(): HexString {
		return this.account.address()
	}

	async signTransaction(transaction: TxnBuilderTypes.RawTransaction): Promise<SignedTransactionResponse> {
		const senderAuthenticator = SupraClient.createSignedTransaction(this.account, transaction)

		return {
			senderAuthenticator: senderAuthenticator as unknown as TxnBuilderTypes.AccountAuthenticatorEd25519,
		}
	}

	async sendTransaction(transaction: Uint8Array): Promise<HexString> {
		const submittedTx = await this.supra.sendTxUsingSerializedRawTransaction(this.account, transaction, {
			enableWaitForTransaction: true,
		})

		return submittedTx.txHash as unknown as HexString
	}

	async signMessage(message: any): Promise<string> {
		const signedMessage = this.account.signHexString(message)

		return signedMessage.toString()
	}
}
