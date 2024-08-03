import { CacheOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { redisStore } from "cache-manager-redis-store";

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
    createCacheOptions(): CacheOptions {
        return {
            //@ts-ignore
            store: async () => await redisStore({
                url: process.env.HOST_REDIS
            })
        }
    }
}