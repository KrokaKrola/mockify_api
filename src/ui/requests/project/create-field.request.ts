import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { FieldTypeEnum } from '../../../domain/project/enums/field-type.enum';

export class CreateFieldRequest {
    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    public name: string;

    @IsNotEmpty()
    @IsEnum(FieldTypeEnum)
    public fieldType: FieldTypeEnum;

    @IsOptional()
    public value: unknown;

    constructor(name: string, fieldType: FieldTypeEnum, value: unknown) {
        this.name = name;
        this.fieldType = fieldType;
        this.value = value;
    }
}
