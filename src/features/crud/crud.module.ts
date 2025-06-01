import { Module } from '@nestjs/common';
import { CrudService } from './providers/crud.service';

@Module({
  imports: [],
  providers: [CrudService as any],
  exports: [CrudService],
})
export class CrudModule {}
