import { z } from "zod";

export const AccountInputSchema = z.object({
	accountId: z.string().uuid(),
	email: z.string().email(),
	cpf: z.string(),
});

export type AccountInput = z.infer<typeof AccountInputSchema>;
