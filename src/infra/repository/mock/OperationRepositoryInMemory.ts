import { Operation } from "@/domain/entities/Operation";
import { RepositoryInMemory } from ".";

export class OperationRepositoryInMemory extends RepositoryInMemory<Operation> {
	constructor(initialRepository?: Operation[]) {
		super(initialRepository || []);
	}
}
