import { z } from 'zod';

const MIN_DATE = '2025-01-01';
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const runningRecordSchema = z.object({
  date: z
    .string()
    .min(1)
    .regex(DATE_REGEX)
    .refine((v) => v >= MIN_DATE),
  distance: z.number().min(0.01),
});

export const planSchema = z.object({
  date: z
    .string()
    .min(1)
    .regex(DATE_REGEX)
    .refine((v) => v >= MIN_DATE),
  planned_distance: z.number().min(0.1).max(999),
  memo: z.string().max(500).optional(),
});

export const monthlyGoalSchema = z.object({
  distance_goal: z.number().min(1),
});

export const yearlyGoalSchema = z.object({
  distance_goal: z.number().min(1),
});

export { DATE_REGEX, MIN_DATE };
