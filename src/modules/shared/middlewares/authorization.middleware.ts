import { HttpException, HttpStatus, NestMiddleware } from "@nestjs/common";
import { UserRepo } from "src/modules/user/user.repository";
import { UserInterface } from "src/modules/user/user.interface";
import * as moment from "moment";
import { TokenService } from "../services/token.service";

export class AuthorizationMiddleWare implements NestMiddleware {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepo: UserRepo
    ) {
        console.log(this.tokenService)
    }

    async use(req: any, res: any, next: (error?: Error | any) => void) {
        //Check authorization header
        let header_authorization = req.header('authorization');
        if (!header_authorization) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'You are unauthorized, please login first',
                    data: null
                },
                HttpStatus.UNAUTHORIZED
            );
        };

        //Get token
        let token: string = header_authorization.split(' ')[1];
        if (!token) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'You are unauthorized, please login first',
                    data: null
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        //Check cache_token
        let cache_token = await this.tokenService.getByToken(token);
        if (!cache_token) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'You are unauthorized, please login first',
                    data: null
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        //Check decode_token
        let decode_token = await this.tokenService.decodeByToken(token);
        if (!decode_token) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'You are unauthorized, please login first',
                    data: null
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        //Verify decode_token and cache_token
        if (cache_token.id != decode_token.id || moment(decode_token.expired_at).diff(moment(), 'second', true) < 0) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'You are unauthorized, please login first',
                    data: null
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        //Get userInfo
        let user: UserInterface = await this.userRepo.findById(decode_token.id);
        if (!user) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'You are unauthorized, please login first',
                    data: null
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        req.tokenInfo = {
            access_token: token,
            user
        }

        next();
    }
}