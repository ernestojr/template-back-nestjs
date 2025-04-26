import { Controller, Put, Param, ParseUUIDPipe, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/guards/roles.guard";
import { Roles } from "../../core/decorators/roles.decorator";
import { RequestValidationPipe } from "../../core/pipes/request-validation.pipe";
import { ChangeUserPasswordDto } from "../dtos/requests/change-user-password.dto";
import { ChangeUserPasswordParams } from "../services/params/change-user-password.params";
import { ChangeUserPasswordService } from "../services/change-user-password.service";

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChangeUserPasswordController {
    constructor(private readonly service: ChangeUserPasswordService) {}

    @Put(':id/change-password')
    @Roles('admin')
    async handle(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body(new RequestValidationPipe()) body: ChangeUserPasswordDto
    ) {
        const params: ChangeUserPasswordParams = { id, ...body };
        await this.service.handle(params);
        return {
            message: 'Contraseña actualizada correctamente',
        };
    }
}
