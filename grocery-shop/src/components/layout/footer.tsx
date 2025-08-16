import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold">Fresh Grocery Market</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted grocery store delivering fresh, quality products to your doorstep.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Shop</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
                All Products
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
                Categories
              </Link>
              <Link href="/fresh-produce" className="text-sm text-muted-foreground hover:text-primary">
                Fresh Produce
              </Link>
              <Link href="/dairy" className="text-sm text-muted-foreground hover:text-primary">
                Dairy
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/help" className="text-sm text-muted-foreground hover:text-primary">
                Help Center
              </Link>
              <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary">
                Returns
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                Careers
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Fresh Grocery Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}