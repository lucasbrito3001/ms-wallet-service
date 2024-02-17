import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { OperationEntity } from "./Operation.entity";
import { WalletEntity } from "./Wallet.entity";

@Entity("account")
export class AccountEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column("varchar")
	email?: string;
	@OneToOne(() => WalletEntity, (wallet) => wallet.account)
	wallet?: WalletEntity;
}
