import { CacheOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";

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