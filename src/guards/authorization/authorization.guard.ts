import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TokenService } from "src/services/shared/token.service";
import * as moment from "moment";
import { UserInterface, UserStatus } from "src/interfaces/user.interface";
import { UserRepo } from "src/repositories/user.repository";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
        private readonly userRepo: UserRepo
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            //Check need auth?
            const secured = this.reflector.get<string[]>('Authorization', context.getHandler());
            if (!secured) return true;

            //Check header auth?
            const request = context.switchToHttp().getRequest();
            const authorization_header = request.headers.authorization;
            if (!authorization_header || !(authorization_header as string).split(' ')[1]) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        message: 'Missing access token',
                        data: null
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }

            //Get token from authorization header
            const access_token = (authorization_header as string).split(' ')[1];
            if (!access_token) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        message: 'Missing access token',
                        data: null
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }

            //Decode token
            const decode_access_token = await this.tokenService.decodeByToken(access_token);
            if (!decode_access_token) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        message: 'Access token invalid',
                        data: null
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }

            //Check cache by access_token
            const cache_access_token = await this.tokenService.getByToken(access_token);
            if (!cache_access_token || moment().diff(cache_access_token.expired_at, 'seconds', true) < 0) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        message: 'Access token expired',
                        data: null
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }

            //Compare decode_access_token and cache_access_token
            if (decode_access_token.id != cache_access_token.id) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        message: 'Access token invalid',
                        data: null
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }

            //Find user by id
            let user: UserInterface = await this.userRepo.findById(cache_access_token.id);
            if (!user) {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        message: 'User not found',
                        data: null
                    },
                    HttpStatus.BAD_REQUEST
                );
            }

            //Update status user
            this.userRepo.updateById(user.id, { status: UserStatus.ONLINE });

            request.tokenInfo = {
                access_token,
                user
            };

            return true;
        }
        catch (e) {
            console.log('AuthCheck Err === ', e);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Unexpected Error',
                    data: null,
                    system_message: e.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}