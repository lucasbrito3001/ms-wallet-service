import { Operation } from "@/domain/entities/Operation";
import { RepositoryDatabase } from ".";
import { Repository } from "typeorm";
import { OperationEntity } from "../entity/Operation.entity";
import { Wallet } from "@/domain/entities/Wallet";
import { WalletEntity } from "../entity/Wallet.entity";

export class WalletRepositoryDatabase extends RepositoryDatabase<Wallet> {
	constructor(repository: Repository<OperationEntity>) {
		super(repository);
	}

	instanceDomain(entity: WalletEntity): Wallet {
		return Wallet.instance(
			entity.id as string,
			entity.balance as number,
			entity.createdAt as string,
			entity.operations as Operation[]
		);
	}
}
