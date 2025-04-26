import { CreateUserParams } from './create-user.params';

export class UpdateUserParams {
    id: string;
    fullname: string;
    email: string;
    dni?: string;
}