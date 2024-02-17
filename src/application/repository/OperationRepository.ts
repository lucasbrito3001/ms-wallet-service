import { Operation } from "@/domain/entities/Operation";

export interface OperationRepository {
	save(operation: Operation): Promise<void>;
}
