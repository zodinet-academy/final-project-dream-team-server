import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";

export interface ICloudinaryService {
  uploadImage(
    file: Express.Multer.File,
    nameFolder: string,
    idFileOld?: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse>;
}
