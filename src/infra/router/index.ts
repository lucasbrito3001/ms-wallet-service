import { Router } from "express";

export abstract class AppRouter {
	constructor(public router: Router) {}

	abstract expose(): void;
}
