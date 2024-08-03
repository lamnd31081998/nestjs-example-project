import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class AuthRegisterDto {
    @ApiProperty({ example: 'lamnd' })
    @IsString()
    @IsNotEmpty()
    username: string
    
    @ApiProperty({ example: 'Lam Nguyen' })
    @IsString()
    @IsNotEmpty()
    name: string
    
    @ApiProperty({ example: 'lamnd@gmail.com' })
    @IsString()
    @IsOptional()
    email: string

    @ApiProperty({ example: '123456789' })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({ example: '123456789' })
    @IsString()
    @IsNotEmpty()
    confirm_password: string
}

export class AuthLoginDto {
    @ApiProperty({ example: 'lamnd' })
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty({ example: '123456789' })
    @IsString()
    @IsNotEmpty()
    password: string
}