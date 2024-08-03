import { Module } from "@nestjs/common";
import { TokenService } from "./services/token.service";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { CacheModule } from "@nestjs/cache-manager";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterDBConfig } from "./configs/master-db.config";
import { CacheConfig } from "./configs/cache.config";
import { JwtConfig } from "./configs/jwt.config";
import { UserEntity } from "../user/user.entity";

@Module({
    imports: [
        /* ENV */
        ConfigModule.forRoot(),

        /* JWT */
        JwtModule.registerAsync({
            useClass: JwtConfig
        }),

        /* CACHE */
        CacheModule.registerAsync({
            useClass: CacheConfig
        }),

        /* MASTER DB */
        TypeOrmModule.forRootAsync({
            useClass: MasterDBConfig
        }),
        TypeOrmModule.forFeature([
            UserEntity
        ]),
    ],
    controllers: [],
    providers: [
        TokenService
    ],
    exports: [
        TokenService,

        ConfigModule,
        JwtModule,
        CacheModule,
        TypeOrmModule
    ]
})

export class SharedModule { }