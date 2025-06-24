import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import useCartStore from "../stores/cartStore";
import { useRouter } from "next/router";

// Accept hideAuthButtons prop to optionally hide sign-in/sign-up buttons
export default function Header({ hideAuthButtons = false }: { hideAuthButtons?: boolean }) {
  const { user } = useUser();
  const cartItems = useCartStore((state) => state.cartItems);
  // Show unique product count, not total quantity
  const cartCount = cartItems.length;
  const router = useRouter();

  return (
    <header className="flex justify-between items-center mb-10">
      <Link href="/" className="flex items-center gap-3 cursor-pointer">
        <Image src="/next.svg" alt="Shop logo" width={40} height={40} />
        <span className="text-2xl font-bold">NextShop</span>
      </Link>
      <nav className="flex gap-6 items-center">
        <button
          className="hover:underline bg-transparent border-none p-0 m-0"
          style={{ background: "none" }}
          onClick={() => {
            if (router.pathname !== "/") {
              router.push("/");
            }
          }}
        >
          Home
        </button>
        <Link href="/plp" className="hover:underline">
          Products
        </Link>
        <Link href="/cart" className="hover:underline flex items-center relative">
          {/* Cart icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}
        </Link>
        {!hideAuthButtons && (
          <>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-gray-200 hover:bg-gray-300 text-blue-700 font-medium px-4 py-2 rounded-lg transition ml-2">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <span className="text-sm mr-2 text-gray-700 dark:text-gray-300">
                Hello, {user?.firstName}
              </span>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </>
        )}
      </nav>
    </header>
  );
}
