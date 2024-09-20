import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInDto {
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string'})
    readonly username: string;

    @IsNotEmpty({ message: 'Password is required'})
    @IsString({ message: 'Password must be a string'})
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    readonly password: string;
}