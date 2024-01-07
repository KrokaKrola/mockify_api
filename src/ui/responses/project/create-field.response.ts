import type { FieldTypeEnum } from '../../../domain/project/enums/field-type.enum';

export class CreateFieldResponse {
    public id: number;

    public name: string;

    public fieldType: FieldTypeEnum;

    public value: unknown;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(
        id: number,
        name: string,
        fieldType: FieldTypeEnum,
        value: unknown,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.name = name;
        this.fieldType = fieldType;
        this.value = value;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
