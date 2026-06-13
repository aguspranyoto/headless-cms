import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

export const drizzleProvider = {
  provide: DRIZZLE_PROVIDER,
  useFactory: () => {
    const queryClient = postgres(process.env.DATABASE_URL!);
    return drizzle(queryClient, { schema });
  },
};
