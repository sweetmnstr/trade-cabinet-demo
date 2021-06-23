import { Transform } from 'class-transformer';
import Phone from 'awesome-phonenumber';
import { BadRequestException } from '@nestjs/common';

export const ToPhone = Transform((value: any) => {
    const phone = new Phone(value);

    if (!phone.isValid()) throw new BadRequestException('INVALID_PHONE');

    return phone.getNumber('e164');
});
