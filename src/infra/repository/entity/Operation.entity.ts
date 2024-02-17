import { OperationOperator, OperationType } from "@/domain/entities/Operation";
import {
	Column,
	ColumnOptions,
	Entity,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import { WalletEntity } from "./Wallet.entity";

const operationTypeColumn =
	(process.env.NODE_ENV as string) === "e2e"
		? { type: "varchar" }
		: { type: "enum", enum: OperationType, nullable: false };

const operationOperatorColumn =
	(process.env.NODE_ENV as string) === "e2e"
		? { type: "varchar" }
		: { type: "enum", enum: OperationOperator, nullable: false };

@Entity("operation")
export class OperationEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column("decimal", { precision: 7, scale: 2, nullable: false })
	amount?: number;
	@Column(operationTypeColumn as ColumnOptions)
	operationType?: OperationType;
	@Column(operationOperatorColumn as ColumnOptions)
	operationOperator?: OperationOperator;
	@Column("datetime", { nullable: false })
	createdAt?: string;
	@ManyToOne(() => WalletEntity, (wallet) => wallet.operations)
	walletId?: string;
}
