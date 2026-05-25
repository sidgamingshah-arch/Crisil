require('dotenv').config();

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

module.exports = {
  development: {
    ...baseConfig,
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'tourmate',
      user: process.env.DB_USER || 'tourmate',
      password: process.env.DB_PASSWORD || 'tourmate_secret',
    },
    pool: { min: 2, max: 10 },
    debug: false,
  },

  test: {
    ...baseConfig,
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.TEST_DB_NAME || 'tourmate_test',
      user: process.env.DB_USER || 'tourmate',
      password: process.env.DB_PASSWORD || 'tourmate_secret',
    },
    pool: { min: 1, max: 5 },
  },

  production: {
    ...baseConfig,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 2, max: 20 },
  },
};
