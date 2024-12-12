import { UploadFileDto } from './upload-file.dto';

export class UploadExcelDto extends UploadFileDto {
    isValidFileType(): boolean {
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        return validTypes.includes(this.file.mimetype);
    }
}