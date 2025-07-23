import Image from "next/image";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import useCartStore from "../../../stores/cartStore";
import useWishlistStore, { useHydrateWishlist } from "../../../stores/wishlistStore";
import { useEffect } from "react";

// UI-safe product type
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

// API raw product structure
type ApiProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductDetail({ product }: { product: Product }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);
  useEffect(() => {
    useHydrateWishlist();
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] p-8">
        <Header />
        <div className="text-center mt-20 text-xl text-red-500">
          Product not found.
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleWishlist = () => {
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-[#232329] dark:to-[#18181b] p-8 pb-20">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-white dark:bg-[#232329] p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-[#232329]">
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto relative">
            <Image
              src={product.image}
              alt={product.name}
              width={180}
              height={180}
              className="rounded-lg object-contain bg-gray-100 dark:bg-[#18181b] shadow-md border border-gray-200"
            />
            {/* Wishlist Icon Button */}
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-pink-100"
              onClick={() => handleWishlist()}
              aria-label="Add to wishlist"
              type="button"
            >
              <svg
                width="28"
                height="28"
                fill={isInWishlist(product.id) ? "red" : "none"}
                stroke="red"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-blue-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm md:text-base">
              {product.description}
            </p>
            <p className="text-xl font-semibold text-blue-600 mb-6">
              {product.price}
            </p>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data: ApiProduct[] = await res.json();

  const paths = data.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);

  if (!res.ok) {
    return { notFound: true };
  }

  const product: ApiProduct = await res.json();

  return {
    props: {
      product: {
        id: product.id,
        name: product.title,
        description: product.description,
        price: `$${product.price}`,
        image: product.image,
      },
    },
    revalidate: 60,
  };
}
