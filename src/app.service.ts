import { Injectable } from '@nestjs/common';
import { Public } from './common/decorators/decorator.common';


@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
}
