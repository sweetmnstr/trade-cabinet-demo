import { Module, Provider } from '@nestjs/common';
import { UsersAuthProvider, UsersUserProvider, UsersClient } from 'lib-clients';
import { RPC_USERS } from '../../common/config';

const providers: Provider[] = [
    {
        provide: UsersClient,
        useValue: new UsersClient(RPC_USERS),
    },
    UsersAuthProvider,
    UsersUserProvider,
];

@Module({
    providers,
    exports: providers,
})
export class MsUsersModule {}
