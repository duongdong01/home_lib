import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { LoggingInterceptor } from "./common/interceptors/interceptor.common";
import { HttpExceptionFilter } from "./common/exceptions/exceptionsFilter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  //swagger
  const config = new DocumentBuilder()
    .setTitle("Home library")
    .setDescription("The Home library API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  app.setGlobalPrefix("api");
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const whileList = configService
    .get<string>("app.whileList")
    .split(",")
    .filter((el) => el.trim());

  app.enableCors({
    origin: function (origin, callback) {
      if (whileList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        throw new BadRequestException("Not in while list");
      }
    },
    credentials: true,
    allowedHeaders:
      "Origin, X-CSRF-TOKEN, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, channel, request-id, Authorization, x-custom-lang",
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH",
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(configService.get<number>("app.port"));
}

bootstrap();
