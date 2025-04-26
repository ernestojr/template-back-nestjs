import { Injectable, PipeTransform, ArgumentMetadata } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ValidationException } from "../exceptions/validation.exception";

@Injectable()
export class RequestValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
            validationError: { target: false }
        });

        if (errors.length > 0) {
            const formattedErrors = this.flattenErrors(errors);
            throw new ValidationException(formattedErrors);
        }

        return value;
    }

    private flattenErrors(errors: ValidationError[], parentField = ''): { field: string; messages: string[] }[] {
        return errors.flatMap((error) => {
            const fieldPath = parentField ? `${parentField}.${error.property}` : error.property;

            // Si es un array, manejamos los errores de manera especial
            if (Array.isArray(error.value)) {
                if (error.children) {
                    return error.children.flatMap((child, index) => {
                        if (child.children && child.children.length > 0) {
                            return this.flattenErrors(child.children, `${fieldPath}[${index}]`);
                        }
                        return [{
                            field: `${fieldPath}[${index}].${child.property}`,
                            messages: Object.values(child.constraints || {})
                        }];
                    });
                }
                // Si no hay children pero hay constraints, es un error de whitelist
                if (error.constraints) {
                    return [{
                        field: fieldPath,
                        messages: Object.values(error.constraints)
                    }];
                }
            }

            // Para objetos anidados normales
            const constraints = error.constraints
                ? [{ field: fieldPath, messages: Object.values(error.constraints) as string[] }]
                : [];

            // Manejo especial para objetos anidados en múltiples niveles
            if (error.children && error.children.length > 0) {
                const childErrors = error.children.flatMap(child => {
                    if (child.children && child.children.length > 0) {
                        return this.flattenErrors(child.children, `${fieldPath}.${child.property}`);
                    }
                    return [{
                        field: `${fieldPath}.${child.property}`,
                        messages: Object.values(child.constraints || {})
                    }];
                });
                return [...constraints, ...childErrors];
            }

            return constraints;
        });
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}