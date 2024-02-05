import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    example: "login",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  login: string;

  @ApiProperty({
    example: "password",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
