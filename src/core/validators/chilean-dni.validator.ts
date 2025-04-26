import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { validate as validateRut } from 'rut.js';

@ValidatorConstraint({ name: 'chileanDniValidator', async: false })
export class ChileanDniValidator implements ValidatorConstraintInterface {
    validate(dni: string) {
        if (typeof dni !== 'string') return false;

        // Validar formato XXXXXXX-X o XXXXXXXX-X
        if (!/^\d{7,8}-[\dkK]$/.test(dni)) return false;

        // Validar RUT usando rut.js
        return validateRut(dni);
    }

    defaultMessage(args: ValidationArguments) {
        const text = args.value;
        if (!/^\d{7,8}-[\dkK]$/.test(text)) {
            return 'El RUT debe tener formato (XXXXXXX-X o XXXXXXXX-X)';
        }
        return 'El RUT no es válido';
    }
}