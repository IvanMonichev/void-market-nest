interface MongoConfig {
  username: string;
  password: string;
  host: string;
  port: string;
  databaseName: string;
  authSource: string;
}

export function getMongoConnectionString(config: MongoConfig): string {
  return `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.databaseName}?authSource=${config.authSource}`;
}
