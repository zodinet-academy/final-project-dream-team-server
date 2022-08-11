import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

export function ApiFile(fieldName = "file", required = false): any {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName)),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: "string",
            format: "binary",
          },
        },
      },
    })
  );
}

export function ApiImageFile(fileName = "image", required = false): any {
  return ApiFile(fileName, required);
}

export function ApiPdfFile(fileName = "document", required = false): any {
  return ApiFile(fileName, required);
}

export function ApiZipFile(fileName = "document", required = false): any {
  return ApiFile(fileName, required);
}
