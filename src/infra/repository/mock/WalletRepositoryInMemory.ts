import { Wallet } from "@/domain/entities/Wallet";
import { RepositoryInMemory } from ".";

export class WalletRepositoryInMemory extends RepositoryInMemory<Wallet> {
	constructor(initialRepository?: Wallet[]) {
		super(initialRepository || []);
	}
}
