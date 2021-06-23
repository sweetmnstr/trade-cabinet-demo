import { Module, Provider } from '@nestjs/common';
import {
    UsersAuthProvider,
    UsersUserProvider,
    UsersClient,
    UsersPaymentsProvider,
    OperatorProvider,
} from 'lib-clients';
import { RPC_USERS } from '../../common/config';

const providers: Provider[] = [
    {
        provide: UsersClient,
        useValue: new UsersClient(RPC_USERS),
    },
    UsersAuthProvider,
    UsersUserProvider,
    UsersPaymentsProvider,
    OperatorProvider,
];

@Module({
    providers,
    exports: providers,
})
export class MsUsersModule {}
