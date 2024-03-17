import { Wallet } from "@/domain/entities/Wallet";
import { IRepository } from "@/infra/repository";

export interface WalletRepository extends IRepository<Wallet> {
	getByAccountId(accountId: string): Promise<Wallet | null>;
}
