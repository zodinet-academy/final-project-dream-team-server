import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export interface ICloudinaryService {
  uploadImage(
    file: Express.Multer.File,
    nameFolder: string,
    idFileOld?: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse>;
  getImageUrl(publicId: string): Promise<string>;
}
