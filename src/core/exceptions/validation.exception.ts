import { BadRequestException, HttpStatus } from '@nestjs/common';

export class ValidationException extends BadRequestException {
    constructor(validationErrors: any[]) {
        super({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors: validationErrors,
        });
    }
}