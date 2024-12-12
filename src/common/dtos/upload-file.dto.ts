import { IsNotEmpty } from 'class-validator';

export abstract class UploadFileDto {
    @IsNotEmpty({ message: 'El archivo es requerido' })
    file: Express.Multer.File;

    // Validación personalizada para el tipo de archivo
    abstract isValidFileType(): boolean;

    // Validación del tamaño del archivo
    isValidFileSize(): boolean {
        const maxSize = 5 * 1024 * 1024; // 5MB
        return this.file.size <= maxSize;
    }
}