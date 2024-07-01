import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDBConfig } from './configs/master-db.config';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    /* ENV */
    ConfigModule.forRoot(),

    /* JWT */
    JwtModule.register({
      global: true,
      secret: process.env.APP_SECRET_KEY,
      signOptions: { expiresIn: process.env.APP_EXPIRES_IN }
    }),

    /* CACHE */
    CacheModule.register<RedisClientOptions>({
      //@ts-ignore
      store: async () => await redisStore({
        url: process.env.HOST_REDIS
      })
    }),

    /* MASTER DB */
    TypeOrmModule.forRootAsync({
      useClass: MasterDBConfig
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
