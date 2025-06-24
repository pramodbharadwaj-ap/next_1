import Image from "next/image";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import useCartStore from "../../../stores/cartStore";

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
  const addToCart = useCartStore((state) => state.addToCart);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-[#232329] dark:to-[#18181b] p-8 pb-20">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-white dark:bg-[#232329] p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-[#232329]">
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto">
            <Image
              src={product.image}
              alt={product.name}
              width={180}
              height={180}
              className="rounded-lg object-contain bg-gray-100 dark:bg-[#18181b] shadow-md border border-gray-200"
            />
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
