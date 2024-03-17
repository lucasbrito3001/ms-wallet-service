import { z } from "zod";

export const AccountInputSchema = z.object({
	id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
});

export type AccountInput = z.infer<typeof AccountInputSchema>;
