import { Injectable } from "@nestjs/common";
import toStream = require("buffer-to-stream");
import { ICloudinaryService } from "./interfaces/cloudinary.interface";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";

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
          if (idFileOld) {
            v2.uploader.destroy(idFileOld);
          }
          resolve(result);
        }
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async getImageUrl(publicId: string): Promise<string> {
    if (publicId) {
      const url = v2.url(publicId);
      return url;
    }

    return "https://cpad.ask.fm/868/263/174/-79996965-206ftsc-cbcii2enl13de50/large/image.jpg";
  }

  deleteImage(pulbicId: string): boolean {
    try {
      v2.uploader.destroy(pulbicId);
      return true;
    } catch (error) {
      return false;
    }
  }
}
