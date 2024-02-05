import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Person } from "./entity/person.entity";
import { Like, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { ReturnCommon, paginating } from "src/common/utilities/base-response";
import { EResponse } from "src/common/interface.common";
import { PaginateDto } from "src/common/dtos/dto.common";
import { UpdatePasswordDto } from "./dto/update-user.dto";
import { IPerson } from "./interfaces/person.interface";
import { USER_ROLE } from "./user.constant";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Person)
    private readonly PersonRepository: Repository<Person>
  ) {}

  async findUserById(id: string) {
    return await this.PersonRepository.findOne({
      where: { id },
    });
  }

  async findUserByLogin(login: string) {
    return await this.PersonRepository.findOne({
      where: { login },
      select: { password: true, id: true, role: true, login: true },
    });
  }

  async createUser(createUserInput: CreateUserDto) {
    const { login, password } = createUserInput;
    const checkUserExisted = await this.PersonRepository.findOne({
      where: { login },
    });
    if (checkUserExisted) {
      throw new BadRequestException("User existed");
    }
    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = this.PersonRepository.create({
      ...createUserInput,
      password: hashPassword,
    });
    const toSaveUser = await this.PersonRepository.save(newUser);

    return ReturnCommon({
      status: EResponse.SUCCESS,
      statusCode: HttpStatus.CREATED,
      data: { user: toSaveUser },
      message: "Create user successfully",
    });
  }

  async createAdmin(createUserInput: CreateUserDto) {
    const { login, password } = createUserInput;
    const checkUserExisted = await this.PersonRepository.findOne({
      where: { login },
    });
    if (checkUserExisted) {
      throw new BadRequestException("User existed");
    }
    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = this.PersonRepository.create({
      ...createUserInput,
      password: hashPassword,
      role: USER_ROLE.ADMIN,
    });
    const toSaveUser = await this.PersonRepository.save(newUser);

    return ReturnCommon({
      status: EResponse.SUCCESS,
      statusCode: HttpStatus.CREATED,
      data: { user: toSaveUser },
      message: "Create admin successfully",
    });
  }

  async getUserById(id: string) {
    const userFound = await this.PersonRepository.findOne({
      where: { id },
    });

    if (!userFound) {
      throw new NotFoundException("User not found");
    }
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: { user: userFound },
      message: "Get user by id successfully",
    });
  }

  async getAllUser(paginateInput: PaginateDto) {
    const { keyword, limit, page } = paginateInput;

    const vLimit = limit && Number(limit) > 0 ? Number(limit) : 10;
    const vPage = page && Number(page) > 0 ? Number(page) : 1;
    const offSet = (vPage - 1) * vLimit;
    const users = await this.PersonRepository.find({
      ...(keyword ? { where: { login: Like(`%${keyword}%`) } } : {}),
      take: vLimit,
      skip: offSet,
    });
    const totalDoc = await this.PersonRepository.count({
      ...(keyword ? { where: { login: Like(`%${keyword}%`) } } : {}),
    });
    const pageDetail = paginating({
      totalDocs: totalDoc,
      page: vPage,
      limit: vLimit,
    });
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: { pageDetail, users },
      message: "Get all user successfully",
    });
  }

  async updateUser({
    id,
    user,
    updatePasswordInput,
  }: {
    id: string;
    user: IPerson;
    updatePasswordInput: UpdatePasswordDto;
  }) {
    const { newPassword, oldPassword } = updatePasswordInput;

    if (id.toString() !== user.id.toString()) {
      throw new ForbiddenException("Cannot update");
    }
    const userFound = await this.PersonRepository.findOne({
      where: { id: user.id },
      select: { password: true, id: true, version: true },
    });

    const isMatch = bcrypt.compareSync(oldPassword, userFound.password);
    if (!isMatch) {
      throw new ForbiddenException("oldPassword is wrong");
    }

    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(newPassword, salt);
    const userDto = this.PersonRepository.create({
      password: hashPassword,
      version: userFound.version + 1,
    });
    await this.PersonRepository.update({ id }, userDto);

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {},
      message: "Update password successfully",
    });
  }

  async deleteUser({ id, user }: { id: string; user: IPerson }) {
    if (user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException("Cannot permission");
    }
    const userFound = await this.PersonRepository.findOne({ where: { id } });
    if (!userFound) {
      throw new NotFoundException("User not found");
    }
    await this.PersonRepository.delete({ id });
    return ReturnCommon({
      statusCode: HttpStatus.NO_CONTENT,
      status: EResponse.SUCCESS,
      data: {},
      message: "Delete user successfully",
    });
  }
}
