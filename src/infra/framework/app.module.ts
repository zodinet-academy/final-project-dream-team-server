import { Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

@Module({
  providers: [Logger],
  imports: [UserModule],
})
export class AppModule {}
