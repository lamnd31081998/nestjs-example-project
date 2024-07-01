import { Body, Controller, Delete, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthLoginDto, AuthRegisterDto } from "src/dtos/auth.dto";
import { Authorization } from "src/guards/authorization/authorization.decorator";
import { AuthService } from "src/services/auth.service";

@Controller('')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    async register(
        @Body() payload: AuthRegisterDto,
        @Res() response: Response
    ) {
        const result = await this.authService.register(payload);
        return response.status(result.status).json(result);
    }

    @Post('login')
    async login(
        @Body() payload: AuthLoginDto,
        @Res() response: Response
    ) {
        const result = await this.authService.login(payload);
        return response.status(result.status).json(result);
    }

    @Delete('logout')
    @Authorization(true)
    async logout(
        @Req() request: any,
        @Res() response: Response
    ) {
        const result = await this.authService.logout(request.tokenInfo);
        return response.status(result.status).json(result);
    }
}