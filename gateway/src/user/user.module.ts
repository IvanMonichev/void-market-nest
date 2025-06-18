import { Module } from '@nestjs/common';
import { HttpModule } from 'src/http/http.module';
import { UserController } from 'src/user/user.controller';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
})
export class UserModule {}
