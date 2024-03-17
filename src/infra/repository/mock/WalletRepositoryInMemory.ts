import { Wallet } from "@/domain/entities/Wallet";
import { RepositoryInMemory } from ".";
import { WalletRepository } from "@/application/repository/WalletRepository";

export class WalletRepositoryInMemory
	extends RepositoryInMemory<Wallet>
	implements WalletRepository
{
	constructor(initialRepository?: Wallet[]) {
		super(initialRepository || []);
	}

	async getByAccountId(accountId: string): Promise<Wallet | null> {
		const wallet = this.repository.find(
			(wallet) => wallet.account.id === accountId
		);

		if (!wallet) return null;

		return wallet;
	}
}
