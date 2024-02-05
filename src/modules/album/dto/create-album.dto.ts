import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from "class-validator";

export class CreateAlbumDto {
  @ApiProperty({
    example: "name",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly name: string;

  @ApiProperty({
    example: 2001,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly year: number;

  @ApiProperty({
    example: "bd8b2df8-6903-490b-b4e3-4a0f24ae5a56",
  })
  @IsUUID()
  @IsOptional()
  readonly artistId?: string;
}
