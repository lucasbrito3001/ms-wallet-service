import { In, Repository } from "typeorm";
import { Wallet } from "@/domain/entities/Wallet";
import { WalletEntity } from "../entity/Wallet.entity";
import { Account } from "@/domain/entities/Account";
import { WalletRepository } from "@/application/repository/WalletRepository";

export class WalletRepositoryDatabase implements WalletRepository {
	constructor(private readonly repository: Repository<WalletEntity>) {}

	async save(entity: Wallet): Promise<void> {
		await this.repository.save(entity);
	}

	async get(id: string, relations: string[]): Promise<Wallet | null> {
		const entity = await this.repository.findOne({
			where: { id },
			relations,
		});

		if (!entity) return null;

		return this.instanceDomain(entity);
	}

	async listByIds(ids: string[]): Promise<Wallet[] | null> {
		const entities = await this.repository.find({
			where: { id: In(ids) },
		});

		if (entities.length === 0) return null;

		return entities.map((entity) => this.instanceDomain(entity));
	}

	async getByAccountId(accountId: string): Promise<Wallet | null> {
		const wallet = await this.repository.findOneBy({
			account: {
				id: accountId,
			},
		});

		if (wallet == null) return null;

		return Wallet.instance(
			wallet.id as string,
			wallet.balance as number,
			wallet.createdAt as string,
			wallet.account as Account
		);
	}

	instanceDomain(entity: WalletEntity): Wallet {
		return Wallet.instance(
			entity.id as string,
			entity.balance as number,
			entity.createdAt as string,
			entity.account as Account
		);
	}
}
