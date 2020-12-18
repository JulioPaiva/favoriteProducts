module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: 5432
    },
    migrations: {
      directory: 'src/migrations'
    }
  },
  prod: {}
}