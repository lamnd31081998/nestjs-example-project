import { Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
    createJwtOptions(): JwtModuleOptions {
        return {
            global: true,
            secret: process.env.APP_SECRET_KEY,
            signOptions: { expiresIn: process.env.APP_EXPIRES_IN }
        }
    }
}