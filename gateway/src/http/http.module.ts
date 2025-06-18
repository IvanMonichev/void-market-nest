import { Module } from '@nestjs/common';
import { AxiosClient } from './http.service';

@Module({
  providers: [AxiosClient],
  exports: [AxiosClient],
})
export class HttpModule {}
