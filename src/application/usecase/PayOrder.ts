import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { WalletRepository } from "../repository/WalletRepository";

export interface PayOrderPort {
	execute(message: Event): void;
}

export class PayOrder implements PayOrderPort {
	private readonly walletRepository: WalletRepository;

	constructor(registry: DependencyRegistry) {
		this.walletRepository = registry.inject("walletRepository");
	}

	execute(message: Event): void {
		throw new Error("Method not implemented.");
	}
}
