// Update with your config settings.
require('dotenv').config();

const { PGUSER, PGHOST, PGPORT, PGDATABASE, PGPASSWORD } = process.env;

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: PGHOST,
      user: PGUSER,
      password: PGPASSWORD,
      database: PGDATABASE,
      port: PGPORT,
    },

    migrations: {
      directory: './db/migrations',
    },
  },
};
