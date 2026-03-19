import { z } from 'zod';
import {
	getRoastHistoryByUsername,
	getRoastResultById,
} from '@/db/queries/roast';
import { getStats } from '@/db/queries/stats';
import { getLeaderboard } from '@/db/queries/submissions';
import { processRoast } from '@/services/roast';
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
	roast: createTRPCRouter({
		create: baseProcedure
			.input(
				z.object({
					code: z.string().min(1).max(50000),
					language: z.string().min(1),
					roastMode: z.boolean(),
					username: z.string().optional(),
				})
			)
			.mutation(async ({ input }) => {
				return processRoast({
					code: input.code,
					language: input.language,
					roastMode: input.roastMode,
					username: input.username,
				});
			}),

		getById: baseProcedure
			.input(z.object({ id: z.string().uuid() }))
			.query(async ({ input }) => {
				return getRoastResultById(input.id);
			}),

		getByUsername: baseProcedure
			.input(z.object({ username: z.string() }))
			.query(async ({ input }) => {
				return getRoastHistoryByUsername(input.username);
			}),
	}),
});

export type AppRouter = typeof appRouter;
