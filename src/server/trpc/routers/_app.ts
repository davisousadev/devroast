import { z } from 'zod';
import { getStats } from '@/db/queries/stats';
import { getLeaderboard } from '@/db/queries/submissions';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
	stats: createTRPCRouter({
		get: baseProcedure.query(async () => {
			return getStats();
		}),
	}),
	leaderboard: createTRPCRouter({
		getTopWorst: baseProcedure
			.input(z.object({ limit: z.number().default(3) }))
			.query(async ({ input }) => {
				return getLeaderboard(input.limit);
			}),
	}),
});

export type AppRouter = typeof appRouter;
