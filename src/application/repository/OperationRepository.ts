import { Operation } from "@/domain/entities/Operation";
import { IRepository } from "@/infra/repository";

export interface OperationRepository extends IRepository<Operation> {
	save(operation: Operation): Promise<void>;
}
