import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class PaginateDto {
  @ApiProperty({
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly limit?: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly page?: number;

  @ApiProperty({
    example: "keyword",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly keyword?: string;
}

export class IdParamDto {
  @ApiProperty({
    example: "bd8b2df8-6903-490b-b4e3-4a0f24ae5a56",
  })
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;
}

export enum CredentialKey {
  SYSTEM_CREATE = "MGMJU97D7WVRANW44JLM9M9PSH2MUWS1JBBW1D9PDJ37J2GMGZYI1CWT7GWWWSE",
}

export class CredentialKeyDto {
  @ApiProperty({
    example: "MGMJU97D7WVRANW44JLM9M9PSH2MUWS1JBBW1D9PDJ37J2GMGZYI1CWT7GWWWSE",
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CredentialKey ,{message :"Key invalid"})
  readonly key: string;
}
