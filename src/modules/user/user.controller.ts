import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { Public } from "src/common/decorators/decorator.common";
import { CreateUserDto } from "./dto/create-user.dto";
import { IdParamDto, PaginateDto } from "src/common/dtos/dto.common";
import { UpdatePasswordDto } from "./dto/update-user.dto";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @ApiOperation({
    summary: "Create user",
  })
  @Post()
  async createUser(@Body() createUserInput: CreateUserDto) {
    return await this.userService.createUser(createUserInput);
  }

  @Public()
  @ApiOperation({
    summary: "Get user By Id",
  })
  @Get("/:id")
  async getUserById(@Param() { id }: IdParamDto) {
    return await this.userService.getUserById(id);
  }

  @Public()
  @ApiOperation({
    summary: "Get all user",
  })
  @Get()
  async getAllUser(@Query() paginateInput: PaginateDto) {
    return await this.userService.getAllUser(paginateInput);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Change password",
  })
  @Put("/:id")
  async updateUser(
    @Request() req: any,
    @Body() updatePasswordInput: UpdatePasswordDto,
    @Param() { id }: IdParamDto
  ) {
    return await this.userService.updateUser({
      id,
      user: req.user,
      updatePasswordInput,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete user by id , Only admin can delete",
  })
  @Delete(":id")
  async deleteUser(@Param() { id }: IdParamDto, @Request() req: any) {
    return await this.userService.deleteUser({ id, user: req.user });
  }
}
