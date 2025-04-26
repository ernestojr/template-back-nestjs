import { Expose } from 'class-transformer';

export class PaginatedUsersDto {
    @Expose()
    id: string;

    @Expose()
    fullname: string;

    @Expose()
    email: string;

    @Expose()
    dni: string;

    @Expose()
    role: string;

    @Expose()
    active: boolean;
}