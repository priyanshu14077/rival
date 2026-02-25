import { IsNotEmpty, IsString, Length, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(5, 100)
    title: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(10, 10000)
    content: string;

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
}
