import { HttpStatus, Injectable } from "@nestjs/common";
import { AuthLoginDto, AuthRegisterDto } from "src/dtos/auth.dto";
import { UserInterface, UserStatus } from "src/interfaces/user.interface";
import { UserRepo } from "src/repositories/user.repository";
import * as bcrypt from "bcrypt";
import { TokenService } from "./shared/token.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepo: UserRepo
    ) { }

    async register(payload: AuthRegisterDto) {
        try {
            //Step 1: Check password and confirm_password
            if (payload.password != payload.confirm_password) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Password and Confirm Password unmatch',
                    data: null
                }
            }

            //Step 2: Check username duplicate
            let user: UserInterface = await this.userRepo.findByUsername(payload.username);
            if (user) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Duplicate username',
                    data: null
                }
            }

            //Step 3: Insert Data to DB
            if (payload?.confirm_password) delete payload.confirm_password;
            let insertData: UserInterface = {
                ...payload
            };
            user = await this.userRepo.create(insertData);

            return {
                status: HttpStatus.CREATED,
                message: 'Register Successfully',
                data: user
            }
        }
        catch (e) {
            console.log('Auth Register Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Unexpected Error',
                data: null,
                system_message: e.message
            }
        }
    }

    async login(payload: AuthLoginDto) {
        try {
            //Step 1: Find user by username
            let user: UserInterface = await this.userRepo.findByUsername(payload.username);
            if (!user) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'User not found',
                    data: null
                }
            }

            //Step 2: Check password
            if (bcrypt.compareSync(payload.password, user.password)) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Password is incorrect',
                    data: null
                }
            }

            //Step 3: Gen access_token
            let access_token = await this.tokenService.create(user);

            //Step 4: Update status user
            let updateData: any = {
                status: UserStatus.ONLINE
            };
            this.userRepo.updateById(user.id, updateData);

            return {
                status: HttpStatus.OK,
                message: 'Login Successfully',
                data: {
                    access_token,
                    user
                }
            }
        }
        catch (e) {
            console.log('Auth Login Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Unexpected Error',
                data: null,
                system_message: e.message
            }
        }
    }

    async logout(tokenInfo: any) {
        try {
            //Delete access token cache
            this.tokenService.deleteByToken(tokenInfo.access_token);

            //Update status user
            this.userRepo.updateById(tokenInfo.user.id, { status: UserStatus.OFFLINE });

            return {
                status: HttpStatus.OK,
                message: 'Logout successfully',
                data: null
            }
        }
        catch (e) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Unexpected Error',
                data: null,
                system_message: e.message
            }
        }
    }
}