import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import { AccountEntity } from "./Account.entity";
import { OperationEntity } from "./Operation.entity";

@Entity("wallet")
export class WalletEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column("decimal", { precision: 7, scale: 2 })
	balance?: number;
	@Column("datetime", { nullable: false })
	createdAt?: string;
	@OneToOne(() => AccountEntity)
	@JoinColumn()
	account?: AccountEntity;
	@OneToMany(() => OperationEntity, (operation) => operation.walletId, {
		cascade: ["insert", "update"],
	})
	operations?: OperationEntity[];
}
