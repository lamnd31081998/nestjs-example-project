import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { AuthorizationMiddleWare } from "../shared/middlewares/authorization.middleware";

@Module({
    imports: [
        SharedModule,
        UserModule
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService,
    ],
    exports: []
})

export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthorizationMiddleWare)
            .forRoutes(
                { path: 'logout', method: RequestMethod.PUT }
            );
    }
}