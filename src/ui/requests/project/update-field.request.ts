import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { FieldTypeEnum } from '../../../domain/project/enums/field-type.enum';

enum PublicFieldTypeEnum {
    STRING = FieldTypeEnum.STRING,
    NUMBER = FieldTypeEnum.NUMBER,
    BOOLEAN = FieldTypeEnum.BOOLEAN,
    ARRAY = FieldTypeEnum.ARRAY,
    DATE = FieldTypeEnum.DATE,
    CREATED_AT = FieldTypeEnum.CREATED_AT,
    UPDATED_AT = FieldTypeEnum.UPDATED_AT,
    DELETED_AT = FieldTypeEnum.DELETED_AT,
    CHILD_RESOURCE = FieldTypeEnum.CHILD_RESOURCE,
    PARENT_RESOURCE = FieldTypeEnum.PARENT_RESOURCE,
    FAKER = FieldTypeEnum.FAKER,
}

export class UpdateFieldRequest {
    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    public name: string;

    @IsNotEmpty()
    @IsEnum(PublicFieldTypeEnum)
    public fieldType: FieldTypeEnum;

    @IsOptional()
    public value: unknown;

    constructor(name: string, fieldType: FieldTypeEnum, value: unknown) {
        this.name = name;
        this.fieldType = fieldType;
        this.value = value;
    }
}
