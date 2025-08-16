import * as React from "react";
import Link from "next/link";
import { ROUTES } from "@/const/routes";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-card shadow-elegant rounded-xl p-6 mb-8">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">Welcome to Billy</h1>
            <p className="text-muted-foreground">Your business management platform</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-card shadow-card rounded-xl p-6 hover:shadow-elegant transition-shadow duration-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground mb-1">Register</h3>
                <p className="text-sm text-muted-foreground">Create a new organization</p>
              </div>
              <Button asChild size="lg" className="min-w-[120px]">
                <Link href={ROUTES.REGISTER}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-card shadow-card rounded-xl p-6 hover:shadow-elegant transition-shadow duration-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground mb-1">Login</h3>
                <p className="text-sm text-muted-foreground">Access your organization</p>
              </div>
              <Button asChild size="lg" variant="outline" className="min-w-[120px]">
                <Link href={ROUTES.LOGIN}>
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
