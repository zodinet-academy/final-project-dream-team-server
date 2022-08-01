import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const initSwagger = (app: INestApplication) => {
  const config = new ConfigService();
  const swaggerConfig = new DocumentBuilder()
    .setTitle("API Document")
    .setDescription("API description")
    .addServer(config.get("SWAGGER_API_SERVER"))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, document);
};
