import type { FieldTypeEnum } from '../../../domain/project/enums/field-type.enum';

export class UpdateFieldResponse {
    public id: number;

    public name: string;

    public fieldType: FieldTypeEnum;

    public value: unknown;

    constructor(id: number, name: string, fieldType: FieldTypeEnum, value: unknown) {
        this.id = id;
        this.name = name;
        this.fieldType = fieldType;
        this.value = value;
    }
}
