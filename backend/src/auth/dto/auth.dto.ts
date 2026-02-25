import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase().trim())
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak. Must contain 1 uppercase, 1 lowercase, and 1 number or special character.',
    })
    password: string;

    @IsOptional()
    @IsString()
    name?: string;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase().trim())
    email: string;

    @IsNotEmpty()
    password: string;
}

export class RefreshTokenDto {
    @IsNotEmpty()
    refreshToken: string;
}
