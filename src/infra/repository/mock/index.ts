import { IRepository } from "..";

export type BaseType = {
	id: string;
};

export class RepositoryInMemory<T extends BaseType> implements IRepository<T> {
	private repository: T[] = [];

	constructor(initialRepository: T[]) {
		this.repository = initialRepository;
	}

	async get(id: string): Promise<T | null> {
		const entity = this.repository.find((entity) => entity.id === id);

		return entity || null;
	}

	async save(entity: T): Promise<void> {
		this.repository.push(entity);
	}

	async listByIds(ids: string[]): Promise<T[] | null> {
		const entities = this.repository.filter((entity) =>
			ids.includes(entity.id)
		);

		return entities.length !== 0 ? entities : null;
	}
}
