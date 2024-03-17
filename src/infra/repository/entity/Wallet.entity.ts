import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { OperationEntity } from "./Operation.entity";
import { AccountEntity } from "./Account.entity";

@Entity("wallet")
export class WalletEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column("decimal", { precision: 7, scale: 2 })
	balance?: number;
	@Column("datetime", { nullable: false })
	createdAt?: string;
	@OneToOne(() => AccountEntity, (account) => account.wallet)
	account?: AccountEntity;
}
