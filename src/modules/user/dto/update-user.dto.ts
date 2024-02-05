import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @ApiProperty({
    example: "oldPassword",
  })
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @ApiProperty({
    example: "newPassword",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}
