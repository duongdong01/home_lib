import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateArtistDto {
  @ApiProperty({
    example: "name",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly name?: string;

  @ApiProperty({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly grammy?: boolean;
}
