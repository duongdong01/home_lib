import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ReturnCommon } from "src/common/utilities/base-response";
import { EResponse } from "src/common/interface.common";
import { CreateUserDto } from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginInput: LoginDto) {
    const { login, password } = loginInput;
    const userFound = await this.userService.findUserByLogin(login);

    if (!userFound) {
      throw new BadRequestException("login or password invalid");
    }

    const isMatch = bcrypt.compareSync(password, userFound.password);

    if (!isMatch) {
      throw new BadRequestException("login or password invalid");
    }

    const token = await this.jwtService.signAsync({
      id: userFound.id,
      login: userFound.login,
      role: userFound.role,
    });
    return ReturnCommon({
      status: EResponse.SUCCESS,
      statusCode: HttpStatus.OK,
      data: { token },
      message: "Login successfullyF",
    });
  }

  async createAdmin(createUserInput: CreateUserDto) {
    return await this.userService.createAdmin(createUserInput);
  }
}
