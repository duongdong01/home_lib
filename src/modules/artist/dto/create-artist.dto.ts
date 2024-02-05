import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateArtistDto {
  @ApiProperty({
    example: "name",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly name: string;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly grammy: boolean;
}
