export class CreateUserParams {
    fullname: string;
    email: string;
    dni: string;
    password: string;
    role?: string;
    active?: boolean;
}
