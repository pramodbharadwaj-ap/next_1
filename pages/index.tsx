import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
  rating?: { rate: number; count: number };
};

export default function Home({ products = [] }: { products: Product[] }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] p-4 sm:p-8 pb-20">
      <Header />
      <Slider />

      <main className="mt-10">
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Featured Products</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No products available.</div>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white dark:bg-[#232329] rounded-2xl shadow hover:shadow-xl transition-all p-4 flex flex-col items-center text-center cursor-pointer"
                style={{ textDecoration: "none" }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={110}
                  height={110}
                  className="mb-3 rounded-lg object-contain"
                  style={{ background: "#f1f5f9" }}
                />
                <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 mb-1">{product.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-1 text-xs italic">{product.category}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-1 text-xs truncate w-full">{product.description}</p>
                <span className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-2">{product.price}</span>
                {product.rating && (
                  <span className="text-xs text-yellow-600 mb-1 flex items-center gap-1">
                    <svg width="14" height="14" fill="currentColor" className="inline-block"><path d="M7 10.5l-4.33 2.28.83-4.84L.5 4.72l4.87-.7L7 0l1.63 4.02 4.87.7-3.5 3.22.83 4.84z"/></svg>
                    {product.rating.rate} ({product.rating.count})
                  </span>
                )}
                <span className="mt-1 text-blue-500 hover:underline text-xs">View Details</span>
              </Link>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    const products = data.map((product: any) => ({
      id: product.id,
      name: product.title,
      description: product.description,
      price: `$${product.price}`,
      image: product.image,
      category: product.category,
      rating: product.rating,
    }));

    return { props: { products } };
  } catch (error) {
    console.error("SSR Error:", error);
    return { props: { products: [] } };
  }
}
