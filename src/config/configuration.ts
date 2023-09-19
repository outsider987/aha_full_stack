export default () => ({
  frontEndPoint: process.env.FRONTEND_ENDPOINT,
  backEndPoint: process.env.BACKEND_ENDPOINT,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  tz: process.env.TZ,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME, 10) || 86400000,
    refreshExpiresIn: parseInt(
        process.env.JWT_REFRESH_EXPIRATION_TIME, 10
    ) || 86400000,
  },
  defaultConnection: {
    type: 'mysql',
    replication: {
      master: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      slaves: [
        {
          host: process.env.DB_READ_HOST ?? process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        },
      ],
    },

    migrations: ['dist/migrations/*.js'],
    entities: ['dist/entities/*.js'],
    synchronize: false,
  },
  gooleOauth: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_ENDPOINT}/auth/google/callback`,
    scope: ['openid', 'email', 'profile'],
  },
});
