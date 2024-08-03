import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepo } from "./user.repository";
import { UserUpdateByTokenDto } from "./user.dto";
import { UserInterface } from "./user.interface";
import * as fs from "fs";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepo
    ) {}

    async updateByToken(tokenInfo: any, payload: UserUpdateByTokenDto, file?: Express.Multer.File) {
        try {
            let user: UserInterface = tokenInfo.user;
            if (user?.password) delete user.password;

            if (file) {
                if (user?.avatar_url) {
                    let old_file_path = user.avatar_url.replace(process.env.SERVER_URL, 'public');
                    if (fs.existsSync(old_file_path)) fs.unlinkSync(old_file_path);
                }

                if (!fs.existsSync('public/avatar')) fs.mkdirSync('public/avatar', { recursive: true });
                fs.renameSync(file.path, `public/avatar/${file.filename}`);
                user.avatar_url = `${process.env.SERVER_URL}/avatar/${file.filename}`;
            }
            else if (payload?.is_delete_avatar && Boolean(payload.is_delete_avatar) && user?.avatar_url) {
                let old_file_path = user.avatar_url.replace(process.env.SERVER_URL, 'public');
                if (fs.existsSync(old_file_path)) fs.unlinkSync(old_file_path);
                user.avatar_url = null;
            }

            user = await this.userRepo.save({ ...user, ...payload });

            return {
                status: HttpStatus.OK,
                message: 'Update user info successfully',
                data: user
            }
        }
        catch(e) {
            console.log('User updateByToken Err === ', e);

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Unexpected Error',
                data: null,
                system_message: e.message
            }
        }
    }
}