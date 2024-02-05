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

export class CreateTrackDto {
  @ApiProperty({
    example: "name",
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: "bd8b2df8-6903-490b-b4e3-4a0f24ae5a56",
  })
  @IsUUID()
  @IsOptional()
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
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  readonly duration: number;
}
