import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { UserInterface } from "./user.interface";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserRepo {
    constructor(
        @InjectRepository(UserEntity) private readonly userModel: Repository<UserInterface>
    ) { }

    async findByUsername(username: string): Promise<UserInterface> {
        return this.userModel.findOneBy({ username, deleted_at: null });
    }

    async findById(id: number): Promise<UserInterface> {
        return this.userModel.findOneBy({ id, deleted_at: null });
    }

    async save(saveData: any): Promise<UserInterface> {
        let current_user: UserInterface = null;
        if (saveData?.id) current_user = await this.findById(saveData.id);
        
        //@ts-ignore
        let dataToSave: UserInterface = this.userModel.create({ ...current_user, ...saveData });
        return this.userModel.save(dataToSave);
    }
}