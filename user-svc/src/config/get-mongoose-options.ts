import { ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { getMongoConnectionString } from 'src/config/get-mongo-connection-string';

const getRequiredEnv = (config: ConfigService, key: string): string => {
  const value = config.get<string>(key);
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const getMongooseOptions = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => ({
      uri: getMongoConnectionString({
        username: getRequiredEnv(configService, 'DB_USER'),
        password: getRequiredEnv(configService, 'DB_PASSWORD'),
        host: getRequiredEnv(configService, 'DB_HOST'),
        port: getRequiredEnv(configService, 'DB_PORT'),
        databaseName: getRequiredEnv(configService, 'DB_NAME'),
        authSource: getRequiredEnv(configService, 'DB_AUTH_SOURCE'),
      }),
    }),
    inject: [ConfigService],
  };
};
