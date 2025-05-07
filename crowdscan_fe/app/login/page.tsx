"use client";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Lottie from "lottie-react";
import scanAnimation from "@/public/animations/login.json";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Animation + Text */}
      <div className="relative bg-[var(--color-primary)] lg:block">
        {/* Decorative blurs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 h-2/3 w-1/3 bg-[var(--color-secondary)] opacity-5 rounded-full blur-[180px] -translate-y-1/2"></div>
          <div className="absolute bottom-1/4 right-0 h-1/4 w-1/4 bg-[var(--color-secondary)] opacity-5 rounded-full blur-[120px]"></div>
        </div>
        
        {/* Animation + Text Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
          <div className="w-full max-w-md">
            <Lottie 
              animationData={scanAnimation} 
              loop={true}
              autoplay={true}
              className="w-full h-auto"
            />
          </div>
          <h1 className="text-accent text-5xl tracking-wide uppercase z-10">
            CrowdScan
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            CrowdScan Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}