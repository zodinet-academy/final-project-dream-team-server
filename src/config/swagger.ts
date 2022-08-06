import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const initSwagger = (app: INestApplication) => {
  const config = new ConfigService();
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Tinder API Document")
    .setDescription("Description of Tinder API clone app")
    .addServer(config.get("SWAGGER_API_SERVER"))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, document);
};
