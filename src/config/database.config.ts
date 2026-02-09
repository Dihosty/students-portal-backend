import * as process from 'node:process';

import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

export const databaseConfigSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_SCHEMA: z.string(),

  POSTGRES_SYNCHRONIZE: z.enum(['true', 'false']).default('false'),
  POSTGRES_DEBUG_SQL: z.enum(['true', 'false']).default('false'),
});

function databaseConfigFactory() {
  const env = databaseConfigSchema.parse(process.env);

  return {
    type: 'postgres' as const,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    schema: env.POSTGRES_SCHEMA,

    synchronize: env.POSTGRES_SYNCHRONIZE === 'true',
    logging: env.POSTGRES_DEBUG_SQL === 'true',

    autoLoadEntities: true,
  };
}

export const DATABASE_CONFIG = registerAs('DATABASE', databaseConfigFactory);
export type DatabaseConfig = ConfigType<typeof DATABASE_CONFIG>;
