import { Account } from "@/domain/entities/Account";
import { IRepository } from "@/infra/repository";

export interface AccountRepository extends IRepository<Account> {
	save(account: Account): Promise<void>;
}
