import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
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
