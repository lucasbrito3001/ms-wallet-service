import { Operation } from "@/domain/entities/Operation";
import { RepositoryInMemory } from ".";
import { Account } from "@/domain/entities/Account";

export class AccountRepositoryInMemory extends RepositoryInMemory<Account> {
	constructor(initialRepository?: Account[]) {
		super(initialRepository || []);
	}
}
