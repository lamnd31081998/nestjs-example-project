import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { UserInterface } from "src/interfaces/user.interface";
import * as moment from "moment";

@Injectable()
export class TokenService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly jwtService: JwtService
    ) {}

    async create(user: UserInterface): Promise<string> {
        const claims = {
            id: user.id,
            expired_at: moment().add(Number(process.env.APP_EXPIRES_IN)).toDate()
        };

        //Create access_token
        const access_token = this.jwtService.sign(claims);

        //Save token into cache
        await this.cache.set(access_token, claims, 7 * 24 * 60 * 60 * 1000 * 1000);

        return access_token;
    }

    async getByToken(access_token: string): Promise<{ id: number, expired_at: Date }> {
        return this.cache.get(access_token);
    }

    async decodeByToken(access_token: string): Promise<{ id: number, expired_at: Date }> {
        return this.jwtService.decode(access_token);
    }

    async deleteByToken(access_token: string): Promise<boolean> {
        try {
            await this.cache.del(access_token);
            return true;
        }
        catch(e) {
            console.log('deleteByToken Err === ', e);
            return false;
        }
    }
}