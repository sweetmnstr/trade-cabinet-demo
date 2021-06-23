import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const USER_TYPE_METADATA_KEY = 'userType';
export const UserType = (type: JWT.UserType): CustomDecorator<string> => SetMetadata(USER_TYPE_METADATA_KEY, type);
