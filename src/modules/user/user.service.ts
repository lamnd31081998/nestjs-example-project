import { Injectable } from "@nestjs/common";
import { UserRepo } from "./user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepo
    ) {}
}