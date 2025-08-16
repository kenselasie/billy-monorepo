import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const seedAttributes = async () => {
  const attributes = [
    {
      slug: 'color',
      name: 'Color',

      values: [
        {
          value: 'Red',
          meta: '#ce1f6a',
        },
        {
          value: 'Blue',
          meta: '#344fa1',
        },
        {
          value: 'White',
          meta: '#e1e5ea',
        },
      ],
    },
    {
      slug: 'size',
      name: 'Size',
      values: [
        {
          value: 'S',
          meta: null,
        },
        {
          value: 'M',
          meta: null,
        },
        {
          value: 'L',
          meta: null,
        },
        {
          value: 'XL',
          meta: null,
        },
      ],
    },
  ];

  const upsertAttributesDataPromises = attributes.map((attr) =>
    prisma.attributes.upsert({
      where: { slug: attr.slug },
      update: {},
      create: {
        name: attr.name,
        slug: attr.slug,
        values: {
          create: attr.values.map((el) => {
            return {
              value: el.value,
              meta: el.value,
            };
          }),
        },
      },
    }),
  );
  const results = await Promise.all(upsertAttributesDataPromises);
  console.log(
    `\nSuccessfully seeded attributes: ${results.map((el) => el.slug)} \n`,
  );
};
