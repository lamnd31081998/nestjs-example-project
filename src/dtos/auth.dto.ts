import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthRegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string
    
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    @IsOptional()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    confirm_password: string
}

export class AuthLoginDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string
}