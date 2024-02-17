import { z } from "zod";

export const OperationInputSchema = z.object({
	walletId: z.string().uuid(),
	amount: z.number().nonnegative(),
});

export type OperationInput = z.infer<typeof OperationInputSchema>;
