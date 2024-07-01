import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { UserInterface } from "src/interfaces/user.interface";
import { Repository, UpdateResult } from "typeorm";

@Injectable()
export class UserRepo {
    constructor(
        @InjectRepository(UserEntity) private readonly userModel: Repository<UserInterface>
    ) {}

    async findByUsername(username: string): Promise<UserInterface> {
        return this.userModel.findOneBy({ username, deleted_at: null });
    }

    async findById(id: number): Promise<UserInterface> {
        return this.userModel.findOneBy({ id, deleted_at: null });
    }

    async create(insertData: UserInterface): Promise<UserInterface> {
        return this.userModel.create(insertData);
    }

    async updateById(id: number, updateData: any): Promise<UserInterface> {
        let update_result: UpdateResult = await this.userModel.update(id, updateData);
        if (update_result?.raw && update_result?.raw?.length > 0) return update_result.raw[0];
        return null;
    }
}