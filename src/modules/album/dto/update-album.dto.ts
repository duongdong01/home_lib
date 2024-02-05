import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export class UpdateAlbumDto {
  @ApiProperty({
    example: "name",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly name?: string;

  @ApiProperty({
    example: 2010,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly year?: number;

  @ApiProperty({
    example: "bd8b2df8-6903-490b-b4e3-4a0f24ae5a56",
  })
  @IsUUID()
  @IsOptional()
  readonly artistId?: string;
}
