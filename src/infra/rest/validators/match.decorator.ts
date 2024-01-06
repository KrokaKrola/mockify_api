import { equals, registerDecorator, ValidatorConstraint } from 'class-validator';
import type {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
    public validate(value: unknown, args?: ValidationArguments): boolean {
        const [propertyNameToCompare] = args?.constraints || [];
        const propertyValue = (args?.object as unknown)[propertyNameToCompare];

        return equals(value, propertyValue);
    }

    public defaultMessage(args?: ValidationArguments): string {
        const [propertyNameToCompare] = args?.constraints || [];

        return `${args?.property} does not match the ${propertyNameToCompare}`;
    }
}

export const Match =
    <T>(property: keyof T, options?: ValidationOptions) =>
    (object: unknown, propertyName: string): void =>
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            constraints: [property],
            validator: MatchConstraint,
        });
