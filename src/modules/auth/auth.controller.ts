import { Body, Controller, Post, Query } from "@nestjs/common";
import { Public } from "src/common/decorators/decorator.common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { CredentialKeyDto } from "src/common/dtos/dto.common";

@ApiTags("auth")
@Public()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() loginInput: LoginDto) {
    return await this.authService.login(loginInput);
  }

  @ApiOperation({summary:"Create admin"})
  @Post("/admin")
  async createAdmin(
    @Body() createUserInput: CreateUserDto,
    @Query() credentialKeyInput: CredentialKeyDto
  ) {
    return await this.authService.createAdmin(createUserInput);
  }
}
