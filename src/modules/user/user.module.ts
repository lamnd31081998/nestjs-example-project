import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { UserRepo } from "./user.repository";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthorizationMiddleWare } from "../shared/middlewares/authorization.middleware";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuthorizationInterceptor } from "../shared/interceptors/authorization.interceptor";

@Module({
    imports: [
        SharedModule
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService,
        
        UserRepo,

        {
            provide: APP_INTERCEPTOR,
            useClass: AuthorizationInterceptor
        }
    ],
    exports: [
        UserRepo
    ]
})

export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthorizationMiddleWare)
            .forRoutes('user');
    }
}