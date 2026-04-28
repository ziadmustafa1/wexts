import { Injectable } from '@nestjs/common';
import { RpcMethod, RpcService } from 'wexts/nest';

@Injectable()
@RpcService({ name: 'hello', requireAuth: false })
export class HelloService {
  @RpcMethod()
  async sayHello(name: string): Promise<string> {
    return `Hello, ${name}!`;
  }
}
