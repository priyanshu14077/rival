import { IsOptional, IsInt, Min, Max, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SortBy {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export class QueryBlogDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 10;

    @IsOptional()
    @IsEnum(SortBy)
    sortBy?: SortBy = SortBy.CREATED_AT;

    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SortOrder.DESC;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @IsString()
    search?: string;
}
