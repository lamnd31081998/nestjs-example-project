import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

export class MasterDBConfig implements TypeOrmOptionsFactory {
    constructor() { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            //@ts-ignore
            type: process.env.MASTER_DB_TYPE,
            host: process.env.MASTER_DB_HOST,
            port: Number(process.env.MASTER_DB_PORT),
            username: process.env.MASTER_DB_USERNAME,
            password: process.env.MASTER_DB_PASSWORD,
            database: process.env.MASTER_DB_NAME,
            retryDelay: 15,
            retryAttempts: 3,
            synchronize: true,
            autoLoadEntities: true
        };
    }
}