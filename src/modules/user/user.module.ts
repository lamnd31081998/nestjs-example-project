import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { UserRepo } from "./user.repository";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        SharedModule
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService,
        
        UserRepo
    ],
    exports: [
        UserRepo
    ]
})

export class UserModule {}