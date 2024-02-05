import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export class UpdateTrackDto {
  @ApiProperty({
    example: "name",
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: "bd8b2df8-6903-490b-b4e3-4a0f24ae5a56",
  })
  @IsOptional()
  @IsUUID()
  readonly albumId?: string;

  @ApiProperty({
    example: "bd8b2df8-6903-490b-b4e3-4a0f24ae5a56",
  })
  @IsUUID()
  @IsOptional()
  readonly artistId?: string;

  @ApiProperty({
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly duration?: number;
}
