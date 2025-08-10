import * as process from 'node:process';

export default () => ({
  host: process.env.SERVER_HOST,
  origin_cors: process.env.ORIGIN_CORS,
  port: process.env.SERVER_PORT,
  database: process.env.DATABASE,
  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  db_user_name: process.env.DB_USER_NAME,
  db_user_password: process.env.DB_USER_PASSWORD,
  jwt_secret: process.env.JWT_SECRET_KEY,
  smtp_mailer_host: process.env.SMTP_MAILER_HOST,
  smtp_mailer_port: process.env.SMTP_MAILER_PORT,
  amq_connection: process.env.AMQ_URL,
  oauth_google_client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
  oauth_google_client_secret_key: process.env.OAUTH_GOOGLE_CLIENT_SECRET_KEY,
  oauth_google_callback_url: process.env.OAUTH_GOOGLE_CALLBACK_URL,
  google_map_api_key: process.env.GOOGLE_MAP_API_KEY
});
