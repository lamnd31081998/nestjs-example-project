import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt"
import { UserStatus } from "./user.interface";

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', unique: true, readonly: true, nullable: false })
    username: string

    @Column({ type: 'varchar', nullable: false,  })
    password: string

    @Column({ type: 'nvarchar', nullable: false })
    name: string

    @Column({ type: 'varchar', unique: true, nullable: true })
    email: string

    @Column({ type: 'varchar', nullable: true })
    avatar_url: string

    @Column({ type: 'enum', nullable: true, enum: UserStatus, default: UserStatus.OFFLINE })
    status: number

    @Column({ type: "timestamp", nullable: true })
    last_active: Date

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deleted_at: Date

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        if (this.password) this.password = bcrypt.hashSync(this.password, 10);
    }
}