import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserUpdateByTokenDto {
    @ApiProperty({ example: 'Lam Nguyen' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 'lamnd@gmail.com' })
    @IsEmail()
    @IsOptional()
    email: string

    @ApiProperty()
    @IsBooleanString()
    @IsOptional()
    is_delete_avatar: string

    @ApiProperty({ type: 'string', format: 'binary' })
    avatar?: any;
}