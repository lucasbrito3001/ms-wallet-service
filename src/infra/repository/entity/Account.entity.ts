import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
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
