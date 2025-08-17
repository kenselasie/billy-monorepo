import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

// Helper function to generate random colors
const getRandomColor = () => {
  const colors = [
    '000000',
    'FFFFFF',
    '333333',
    'CCCCCC',
    '666666',
    '999999',
    'FF0000',
    '00FF00',
    '0000FF',
    'FFFF00',
    'FF00FF',
    '00FFFF',
    'FFA500',
    '800080',
    '008000',
    'FF6B35',
    '4ECDC4',
    '45B7D1',
    'E74C3C',
    '2ECC71',
    'F39C12',
    '9B59B6',
    '1ABC9C',
    '34495E',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper function to generate product image with random colors
const generateProductImage = () => {
  const bg = getRandomColor();
  const fg = getRandomColor();
  return `https://placehold.co/600x400/${bg}/${fg}.png`;
};

export const seedSampleUsers = async () => {
  const email = process.env.ADMIN_USER_EMAIL!;
  const password = process.env.ADMIN_USER_PASSWORD!;

  const users = [
    {
      first_name: 'Kennedy',
      last_name: 'Selasie',
      password,
      email,
      roles: [
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
      ],
      stores: [
        {
          name: 'Grocery Store',
          slug: 'grocery-store',
          description: 'A trail grocery store',
          is_active: true,
          address: {
            country: 'Ghana',
            street: 'Street 1',
            city: 'Accra',
            state: 'Greater Accra',
            postal_code: '00233',
            latitude: 5.6037,
            longitude: -0.187,
          },
          categories: [
            {
              name: 'Fresh Produce',
              slug: 'fresh-produce',
              details: 'Fresh fruits, vegetables, and herbs',
              icon: 'leaf',
              image: 'https://placehold.co/600x400/000000/FFd2FF.png',
            },
            {
              name: 'Dairy & Eggs',
              slug: 'dairy-eggs',
              details: 'Milk, cheese, yogurt, and fresh eggs',
              icon: 'milk',
              image: 'https://placehold.co/600x400/000000/FFFFFF.png',
            },
            {
              name: 'Meat & Seafood',
              slug: 'meat-seafood',
              details: 'Fresh and frozen meat, poultry, and seafood',
              icon: 'beef',
              image: 'https://placehold.co/600x400/000000/FFd2FF.png',
            },
            {
              name: 'Bakery',
              slug: 'bakery',
              details: 'Fresh bread, pastries, and baked goods',
              icon: 'bread-slice',
              image: 'https://placehold.co/600x400/000000/FFFFFF.png',
            },
            {
              name: 'Pantry Staples',
              slug: 'pantry-staples',
              details: 'Rice, pasta, canned goods, and cooking essentials',
              icon: 'shopping-basket',
              image: 'https://placehold.co/600x400/000000/FFd2FF.png',
            },
            {
              name: 'Beverages',
              slug: 'beverages',
              details: 'Juices, sodas, water, and hot beverages',
              icon: 'coffee',
              image: 'https://placehold.co/600x400/000000/FFFFFF.png',
            },
            {
              name: 'Snacks & Confectionery',
              slug: 'snacks-confectionery',
              details: 'Chips, cookies, candy, and sweet treats',
              icon: 'cookie',
              image: 'https://placehold.co/600x400/000000/FFd2FF.png',
            },
            {
              name: 'Frozen Foods',
              slug: 'frozen-foods',
              details: 'Frozen vegetables, meals, and ice cream',
              icon: 'snowflake',
              image: 'https://placehold.co/600x400/000000/FFFFFF.png',
            },
            {
              name: 'Health & Personal Care',
              slug: 'health-personal-care',
              details: 'Vitamins, supplements, and personal care items',
              icon: 'heart-pulse',
              image: 'https://placehold.co/600x400/000000/FFd2FF.png',
            },
            {
              name: 'Household Items',
              slug: 'household-items',
              details: 'Cleaning supplies, paper products, and home essentials',
              icon: 'home',
              image: 'https://placehold.co/600x400/000000/FFFFFF.png',
            },
          ],
          products: [
            // Fresh Produce Products
            {
              name: 'Organic Bananas',
              slug: 'organic-bananas',
              description:
                'Fresh organic bananas, perfect for snacking or smoothies',
              price: 2.49,
              sale_price: 1.99,
              sku: 'PROD-001',
              quantity: 150,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 500,
              images: [generateProductImage(), generateProductImage()],
              tags: ['organic', 'fruit', 'healthy'],
              meta_title: 'Organic Bananas - Fresh & Healthy',
              meta_description:
                'Buy fresh organic bananas online. Perfect for healthy snacking.',
              categorySlug: 'fresh-produce',
            },
            {
              name: 'Fresh Spinach Leaves',
              slug: 'fresh-spinach-leaves',
              description: 'Crisp, fresh spinach leaves packed with nutrients',
              price: 3.99,
              sku: 'PROD-002',
              quantity: 80,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 200,
              images: [generateProductImage()],
              tags: ['leafy', 'vegetable', 'healthy', 'organic'],
              meta_title: 'Fresh Spinach Leaves - Nutritious Greens',
              meta_description:
                'Fresh, crisp spinach leaves perfect for salads and cooking.',
              categorySlug: 'fresh-produce',
            },

            // Dairy & Eggs Products
            {
              name: 'Whole Milk - 1 Gallon',
              slug: 'whole-milk-1-gallon',
              description:
                'Fresh whole milk from local farms, rich in calcium and protein',
              price: 4.29,
              sku: 'PROD-003',
              quantity: 60,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage()],
              tags: ['dairy', 'milk', 'calcium', 'protein'],
              meta_title: 'Whole Milk 1 Gallon - Farm Fresh',
              meta_description:
                'Fresh whole milk from local farms, perfect for families.',
              categorySlug: 'dairy-eggs',
            },
            {
              name: 'Free-Range Eggs - Dozen',
              slug: 'free-range-eggs-dozen',
              description: 'Farm-fresh free-range eggs from happy hens',
              price: 5.99,
              sale_price: 4.99,
              sku: 'PROD-004',
              quantity: 45,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage(), generateProductImage()],
              tags: ['eggs', 'free-range', 'protein', 'farm-fresh'],
              meta_title: 'Free-Range Eggs Dozen - Farm Fresh',
              meta_description:
                'Fresh free-range eggs from happy, healthy hens.',
              categorySlug: 'dairy-eggs',
            },

            // Meat & Seafood Products
            {
              name: 'Atlantic Salmon Fillet',
              slug: 'atlantic-salmon-fillet',
              description:
                'Fresh Atlantic salmon fillet, rich in omega-3 fatty acids',
              price: 12.99,
              sku: 'PROD-005',
              quantity: 25,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 450,
              images: [generateProductImage()],
              tags: ['seafood', 'salmon', 'omega-3', 'protein'],
              meta_title: 'Atlantic Salmon Fillet - Fresh Seafood',
              meta_description:
                'Fresh Atlantic salmon fillet, perfect for healthy meals.',
              categorySlug: 'meat-seafood',
            },
            {
              name: 'Ground Beef - 1lb',
              slug: 'ground-beef-1lb',
              description: 'Lean ground beef, perfect for burgers and cooking',
              price: 8.99,
              sku: 'PROD-006',
              quantity: 35,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 454,
              images: [generateProductImage()],
              tags: ['beef', 'meat', 'protein', 'lean'],
              meta_title: 'Ground Beef 1lb - Lean & Fresh',
              meta_description: 'Fresh lean ground beef, perfect for cooking.',
              categorySlug: 'meat-seafood',
            },

            // Bakery Products
            {
              name: 'Artisan Sourdough Bread',
              slug: 'artisan-sourdough-bread',
              description:
                'Freshly baked artisan sourdough bread with crispy crust',
              price: 6.49,
              sku: 'PROD-007',
              quantity: 30,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage()],
              tags: ['bread', 'sourdough', 'artisan', 'fresh'],
              meta_title: 'Artisan Sourdough Bread - Freshly Baked',
              meta_description: 'Fresh artisan sourdough bread baked daily.',
              categorySlug: 'bakery',
            },
            {
              name: 'Chocolate Croissants - 4 Pack',
              slug: 'chocolate-croissants-4-pack',
              description:
                'Buttery, flaky croissants filled with rich chocolate',
              price: 7.99,
              sale_price: 6.99,
              sku: 'PROD-008',
              quantity: 20,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage(), generateProductImage()],
              tags: ['croissant', 'chocolate', 'pastry', 'bakery'],
              meta_title: 'Chocolate Croissants 4-Pack - Buttery Pastries',
              meta_description:
                'Delicious chocolate-filled croissants, perfect for breakfast.',
              categorySlug: 'bakery',
            },

            // Pantry Staples Products
            {
              name: 'Jasmine Rice - 5lb Bag',
              slug: 'jasmine-rice-5lb-bag',
              description: 'Premium jasmine rice with aromatic fragrance',
              price: 9.99,
              sku: 'PROD-009',
              quantity: 40,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 2268,
              images: [generateProductImage()],
              tags: ['rice', 'jasmine', 'grain', 'staple'],
              meta_title: 'Jasmine Rice 5lb - Premium Quality',
              meta_description:
                'Premium aromatic jasmine rice, perfect for any meal.',
              categorySlug: 'pantry-staples',
            },
            {
              name: 'Extra Virgin Olive Oil',
              slug: 'extra-virgin-olive-oil',
              description:
                'Cold-pressed extra virgin olive oil from Mediterranean olives',
              price: 14.99,
              sku: 'PROD-010',
              quantity: 25,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage()],
              tags: ['olive oil', 'extra virgin', 'cooking', 'mediterranean'],
              meta_title: 'Extra Virgin Olive Oil - Mediterranean Quality',
              meta_description:
                'Premium extra virgin olive oil for cooking and dressing.',
              categorySlug: 'pantry-staples',
            },

            // Beverages Products
            {
              name: 'Freshly Squeezed Orange Juice',
              slug: 'fresh-orange-juice',
              description:
                'Pure orange juice squeezed from fresh oranges, no added sugar',
              price: 5.49,
              sku: 'PROD-011',
              quantity: 50,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage()],
              tags: ['juice', 'orange', 'fresh', 'vitamin-c'],
              meta_title: 'Fresh Orange Juice - Pure & Natural',
              meta_description:
                'Fresh squeezed orange juice with no added sugar.',
              categorySlug: 'beverages',
            },
            {
              name: 'Premium Coffee Beans - Dark Roast',
              slug: 'premium-coffee-beans-dark-roast',
              description:
                'Rich, bold dark roast coffee beans from South America',
              price: 16.99,
              sale_price: 14.99,
              sku: 'PROD-012',
              quantity: 35,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 340,
              images: [generateProductImage(), generateProductImage()],
              tags: ['coffee', 'dark roast', 'premium', 'beans'],
              meta_title: 'Premium Dark Roast Coffee Beans',
              meta_description:
                'Rich, bold dark roast coffee beans for the perfect cup.',
              categorySlug: 'beverages',
            },

            // Snacks & Confectionery Products
            {
              name: 'Mixed Nuts - Salted',
              slug: 'mixed-nuts-salted',
              description:
                'Premium mix of roasted and salted nuts including almonds, cashews, and peanuts',
              price: 8.99,
              sku: 'PROD-013',
              quantity: 60,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 250,
              images: [generateProductImage()],
              tags: ['nuts', 'snack', 'salted', 'protein'],
              meta_title: 'Mixed Nuts Salted - Premium Snack',
              meta_description:
                'Delicious mix of roasted salted nuts, perfect for snacking.',
              categorySlug: 'snacks-confectionery',
            },
            {
              name: 'Dark Chocolate Bar - 70% Cocoa',
              slug: 'dark-chocolate-bar-70-cocoa',
              description: 'Rich dark chocolate bar with 70% cocoa content',
              price: 4.99,
              sku: 'PROD-014',
              quantity: 80,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 100,
              images: [generateProductImage()],
              tags: ['chocolate', 'dark', '70% cocoa', 'premium'],
              meta_title: 'Dark Chocolate Bar 70% Cocoa - Premium',
              meta_description:
                'Rich dark chocolate bar with intense cocoa flavor.',
              categorySlug: 'snacks-confectionery',
            },

            // Frozen Foods Products
            {
              name: 'Frozen Mixed Berries',
              slug: 'frozen-mixed-berries',
              description:
                'Frozen mix of strawberries, blueberries, and raspberries',
              price: 6.99,
              sku: 'PROD-015',
              quantity: 45,
              in_stock: true,
              status: 'PUBLISHED',
              weight: 500,
              images: [generateProductImage()],
              tags: ['frozen', 'berries', 'fruit', 'antioxidants'],
              meta_title: 'Frozen Mixed Berries - Antioxidant Rich',
              meta_description:
                'Frozen mixed berries perfect for smoothies and desserts.',
              categorySlug: 'frozen-foods',
            },
            {
              name: 'Vanilla Ice Cream - 1 Quart',
              slug: 'vanilla-ice-cream-1-quart',
              description:
                'Creamy vanilla ice cream made with real vanilla beans',
              price: 7.49,
              sale_price: 5.99,
              sku: 'PROD-016',
              quantity: 30,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage(), generateProductImage()],
              tags: ['ice cream', 'vanilla', 'dessert', 'frozen'],
              meta_title: 'Vanilla Ice Cream 1 Quart - Creamy & Rich',
              meta_description:
                'Creamy vanilla ice cream made with real vanilla beans.',
              categorySlug: 'frozen-foods',
            },

            // Health & Personal Care Products
            {
              name: 'Multivitamin Tablets - 90 Count',
              slug: 'multivitamin-tablets-90-count',
              description:
                'Complete daily multivitamin with essential vitamins and minerals',
              price: 19.99,
              sku: 'PROD-017',
              quantity: 40,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage()],
              tags: ['vitamins', 'supplements', 'health', 'daily'],
              meta_title: 'Multivitamin Tablets 90 Count - Daily Health',
              meta_description:
                'Complete daily multivitamin for optimal health and wellness.',
              categorySlug: 'health-personal-care',
            },
            {
              name: 'Natural Hand Soap - Lavender',
              slug: 'natural-hand-soap-lavender',
              description:
                'Gentle natural hand soap with lavender essential oil',
              price: 3.99,
              sku: 'PROD-018',
              quantity: 70,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage()],
              tags: ['soap', 'natural', 'lavender', 'hand care'],
              meta_title: 'Natural Lavender Hand Soap - Gentle Care',
              meta_description:
                'Natural hand soap with soothing lavender scent.',
              categorySlug: 'health-personal-care',
            },

            // Household Items Products
            {
              name: 'All-Purpose Cleaner - Lemon Scent',
              slug: 'all-purpose-cleaner-lemon',
              description:
                'Effective all-purpose cleaner with fresh lemon scent',
              price: 4.49,
              sku: 'PROD-019',
              quantity: 55,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage()],
              tags: ['cleaner', 'all-purpose', 'lemon', 'household'],
              meta_title: 'All-Purpose Cleaner Lemon - Effective Cleaning',
              meta_description:
                'Powerful all-purpose cleaner with refreshing lemon scent.',
              categorySlug: 'household-items',
            },
            {
              name: 'Paper Towels - 8 Roll Pack',
              slug: 'paper-towels-8-roll-pack',
              description: 'Absorbent paper towels for all your cleaning needs',
              price: 12.99,
              sale_price: 10.99,
              sku: 'PROD-020',
              quantity: 25,
              in_stock: true,
              status: 'PUBLISHED',
              images: [generateProductImage(), generateProductImage()],
              tags: ['paper towels', 'cleaning', 'absorbent', 'household'],
              meta_title: 'Paper Towels 8-Pack - Super Absorbent',
              meta_description:
                'High-quality absorbent paper towels for home and office.',
              categorySlug: 'household-items',
            },
          ],
        },
      ],
      is_active: true,
    },
  ];

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const upsertUsers = users.map(async (usr) => {
    const user = await prisma.user.upsert({
      where: { email: usr.email },
      update: {},
      create: {
        first_name: usr.first_name,
        last_name: usr.last_name,
        email: usr.email,
        password: hash,
        is_active: usr.is_active,
      },
    });

    // Connect or create all roles in parallel
    const rolePromises = usr.roles.map((r) =>
      prisma.user.update({
        where: { id: user.id },
        data: {
          roles: {
            connectOrCreate: {
              where: { name: r.name },
              create: {
                name: r.name,
                description: r.description || '',
              },
            },
          },
        },
      }),
    );

    // const storePromises = usr.stores.map((s) =>{

    const storePromises = usr.stores.map(async (s) => {
      const store = await prisma.store.upsert({
        where: { slug: s.slug },
        update: {},
        create: {
          name: s.name,
          slug: s.slug,
          description: s.description,
          is_active: s.is_active,
          owner: {
            connect: {
              id: user.id,
            },
          },
          address: {
            create: {
              country: s.address.country,
              street: s.address.street,
              city: s.address.city,
              state: s.address.state,
              postal_code: s.address.postal_code,
              latitude: s.address.latitude.toString(),
              longitude: s.address.longitude.toString(),
            },
          },
        },
      });

      // Create categories for this store if they exist
      if (s.categories && s.categories.length > 0) {
        const categoryPromises = s.categories.map(async (cat) => {
          await prisma.category.upsert({
            where: {
              slug_storeId: {
                slug: cat.slug,
                storeId: store.id,
              },
            },
            update: {},
            create: {
              name: cat.name,
              slug: cat.slug,
              details: cat.details,
              icon: cat.icon,
              image: cat.image,
              storeId: store.id,
            },
          });
        });
        await Promise.all(categoryPromises);
      }

      // Create products for this store if they exist
      if (s.products && s.products.length > 0) {
        const productPromises = s.products.map(async (prod) => {
          const product = await prisma.products.upsert({
            where: { slug: prod.slug },
            update: {},
            create: {
              name: prod.name,
              slug: prod.slug,
              description: prod.description,
              price: prod.price,
              sale_price: prod.sale_price,
              sku: prod.sku,
              quantity: prod.quantity,
              in_stock: prod.in_stock,
              status:
                prod.status as any as import('@prisma/client').ProductStatus,
              weight: prod.weight,
              images: prod.images,
              tags: prod.tags,
              meta_title: prod.meta_title,
              meta_description: prod.meta_description,
              storeId: store.id,
            },
          });

          // Associate product with category if categorySlug is provided
          if (prod.categorySlug) {
            const category = await prisma.category.findUnique({
              where: {
                slug_storeId: {
                  slug: prod.categorySlug,
                  storeId: store.id,
                },
              },
            });

            if (category) {
              await prisma.productCategory.upsert({
                where: {
                  productId_categoryId: {
                    productId: product.id,
                    categoryId: category.id,
                  },
                },
                update: {},
                create: {
                  productId: product.id,
                  categoryId: category.id,
                },
              });
            }
          }
        });
        await Promise.all(productPromises);
      }
    });

    await Promise.all(rolePromises);
    await Promise.all(storePromises);
    return user;
  });
  const results = await Promise.all(upsertUsers);
  console.log(`\nSuccessfully seeded user: ${results.map((el) => el.email)}\n`);
};
