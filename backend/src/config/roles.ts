import { Role } from '../generated/prisma/index.js';

const allRoles = {
    [Role.USER]: ['getOwnItems', 'manageOwnItems'],
    [Role.ADMIN]: ['getUsers', 'manageUsers', 'getOwnItems', 'manageOwnItems']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
