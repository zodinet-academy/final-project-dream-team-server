import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryResponse } from "./cloudinary-response";
import * as streamifier from "streamifier";
import { ResponseImage } from "./dto/response-image.dto";

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultipleImages(
    files: Array<Express.Multer.File>
  ): Promise<ResponseImage[] | undefined> {
    try {
      const images: ResponseImage[] = [];
      const length = files.length;

      for (let i = 0; i < length; i++) {
        const result = await this.uploadFile(files[i]);
        if (result.url) {
          const responseImage: ResponseImage = {
            url: result.url,
            publicId: result.public_id,
          };
          images.push(responseImage);
        }
      }

      return images;
    } catch (error) {
      return undefined;
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteImages(publicIds: string[]): Promise<boolean> {
    try {
      const length = publicIds.length;
      for (let i = 0; i < length; i++) {
        await cloudinary.uploader.destroy(publicIds[i]);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
