import { Body, Controller, Post, Put, Req, Res, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthLoginDto, AuthRegisterDto } from "./auth.dto";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthorizationInterceptor } from "../shared/interceptors/authorization.interceptor";

@ApiTags('auth')
@Controller('')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    @ApiInternalServerErrorResponse()
    @ApiBadRequestResponse()
    @ApiCreatedResponse()
    async register(
        @Body() payload: AuthRegisterDto,
        @Res() response: Response
    ) {
        const result = await this.authService.register(payload);
        return response.status(result.status).json(result);
    }

    @Post('login')
    @UseInterceptors(AuthorizationInterceptor)
    @ApiInternalServerErrorResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse()
    async login(
        @Body() payload: AuthLoginDto,
        @Res() response: Response
    ) {
        const result = await this.authService.login(payload);
        return response.status(result.status).json(result);
    }

    @Put('logout')
    @ApiBearerAuth()
    @ApiHeader({ name: 'token', description: 'Bearer Token', required: true })
    @UseInterceptors(AuthorizationInterceptor)
    @ApiUnauthorizedResponse()
    @ApiForbiddenResponse()
    @ApiInternalServerErrorResponse()
    @ApiBadRequestResponse()
    @ApiOkResponse()
    async logout(
        @Req() request: any,
        @Res() response: Response
    ) {
        const result = await this.authService.logout(request.tokenInfo);
        return response.status(result.status).json(result);
    }
}