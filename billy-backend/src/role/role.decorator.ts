import { Reflector } from '@nestjs/core';

type TRoles = 'super_admin' | 'store_owner' | 'staff' | 'customer';
export const Roles = Reflector.createDecorator<TRoles[]>();
