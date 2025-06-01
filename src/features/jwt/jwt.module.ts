import { Module, Global } from '@nestjs/common';
import { JwtService } from './providers/jwt.service';
import { CommonModule } from 'src/common/common.module';

@Global()
@Module({
  imports: [CommonModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}