import { WalletRepositoryInMemory } from "./mock/WalletRepositoryInMemory";
import { OperationRepositoryInMemory } from "./mock/OperationRepositoryInMemory";
import { WalletRepositoryDatabase } from "./database/WalletRepositoryDatabase";
import { OperationRepositoryDatabase } from "./database/OperationRepositoryDatabase";

export interface IRepository<T> {
	get(id: string, relations?: string[]): Promise<T | null>;
	save(entity: T): Promise<void>;
	listByIds(ids: string[]): Promise<T[] | null>;
}

export {
	WalletRepositoryInMemory,
	OperationRepositoryInMemory,
	WalletRepositoryDatabase,
	OperationRepositoryDatabase,
};
