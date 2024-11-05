export class CreateUserDto {
  fullname: string;
  email: string;
  rut: string;
  password: string;
  role?: string;
  active?: boolean;
}
