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
        let dataToSave: UserInterface = null;
        if (saveData?.id) {
            //@ts-ignore
            dataToSave = this.userModel.create(saveData);
        }
        else {
            let user: UserInterface = await this.findByUsername(saveData.username);
            //@ts-ignore
            dataToSave = this.userModel.create({ ...user, ...saveData });
            if (dataToSave?.password && !saveData?.password) delete dataToSave.password;
        }
        
        return this.userModel.save(dataToSave);
    }
}