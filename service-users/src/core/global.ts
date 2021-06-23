import { Global, Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbPlus } from './db-plus';

const providers = [DbPlus, Logger];

@Global()
@Module({
    imports: [TypeOrmModule.forRoot()],
    providers,
    exports: providers,
})
export class GlobalModule {}
