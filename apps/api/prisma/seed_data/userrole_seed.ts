import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const seedUserRoles = async () => {
  const userRoles = [
    {
      name: 'super_admin',
      description:
        'A user within an organization with full access to all resources within the organization',
    },
    {
      name: 'store_owner',
      description:
        'A user who owns creates a store and owns everything regarding its functionality',
    },
    {
      name: 'customer',
      description: 'A customer of any store',
    },
    {
      name: 'staff',
      description:
        'This is a staff of a company that can perform actions on behalf of the store_owner',
    },
  ];

  const upsertUserRolesPromises = userRoles.map((userRole) =>
    prisma.userRole.upsert({
      where: { name: userRole.name },
      update: {},
      create: userRole,
    }),
  );
  const results = await Promise.all(upsertUserRolesPromises);
  console.log(
    `\nSuccessfully seeded user roles: ${results.map((el) => el.name)}\n`,
  );
};
