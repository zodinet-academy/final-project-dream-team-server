import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import toStream = require("buffer-to-stream");
import { ICloudinaryService } from "./interfaces/cloudinary.interface";

@Injectable()
export class CloudinaryService implements ICloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    nameFolder: string,
    idFileOld?: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: nameFolder,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      if (idFileOld) {
        v2.uploader.destroy(idFileOld);
      }

      toStream(file.buffer).pipe(upload);
    });
  }
}
