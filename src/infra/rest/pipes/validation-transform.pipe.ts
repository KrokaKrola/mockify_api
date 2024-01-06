import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

interface IValidationError {
    property: string;
    errors: string[];
    constraints: {
        [type: string]: string;
    };
}

type MetaType = string | boolean | number | [] | object;

/**
 * Validation Pipe.
 * Gets Validation errors and creates custom error messages
 */
@Injectable()
export class ValidationTransformPipe implements PipeTransform<unknown> {
    public async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<unknown> {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new UnprocessableEntityException(this.formatErrors(errors));
        }

        return value;
    }

    private toValidate(metatype: MetaType): boolean {
        const types: MetaType[] = [String, Boolean, Number, Array, Object];

        return !types.includes(metatype);
    }

    private formatErrors(errors: ValidationError[], parentProperty = null): IValidationError[] {
        const res = [];

        for (const error of errors) {
            if (error.children && error.children.length > 0) {
                res.push(
                    ...this.formatErrors(
                        error.children,
                        parentProperty ? `${parentProperty}.${error.property}` : error.property,
                    ),
                );
            }

            if (error.constraints) {
                res.push({
                    property: parentProperty
                        ? `${parentProperty}.${error.property}`
                        : error.property,
                    errors: Object.keys(error.constraints),
                    constraints: error.constraints,
                });
            }
        }

        return [...res];
    }
}
