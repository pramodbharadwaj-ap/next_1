import { useUser, SignInButton } from "@clerk/nextjs";
import useCartStore from "../../stores/cartStore";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";

const HeaderSpacer = () => <div style={{ height: "2.5rem" }} />;

export default function Cart() {
  const cartItems = useCartStore((state) => state.cartItems);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const { isSignedIn } = useUser();

  // Always show the same header, regardless of login state
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] p-8 pb-20">
      <Header />
      <HeaderSpacer />
      {!isSignedIn ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-3xl font-bold mb-6">Please Sign In to view your cart</h1>
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto mt-10">
          <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
          {cartItems && cartItems.length > 0 ? (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Cart Items */}
              <section className="md:w-2/3 space-y-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#232329] rounded-lg shadow p-5 flex flex-col md:flex-row items-center gap-4"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded mb-2 md:mb-0"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                      <p className="text-gray-500 dark:text-gray-300 mb-2">{item.price}</p>
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                          onClick={() => decrement(item.id)}
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity || 1}</span>
                        <button
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                          onClick={() => increment(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </section>
              {/* Order Summary */}
              <aside className="md:w-1/3 bg-white dark:bg-[#232329] rounded-lg shadow p-6 h-fit">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <ul className="space-y-2">
                  {cartItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity || 1}</span>
                      <span>
                        $
                        {(
                          parseFloat(item.price.replace(/[^0-9.]/g, "")) *
                          (item.quantity || 1)
                        ).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    $
                    {cartItems
                      .reduce(
                        (sum, item) =>
                          sum +
                          parseFloat(item.price.replace(/[^0-9.]/g, "")) *
                            (item.quantity || 1),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </aside>
            </div>
          ) : (
            <p className="text-center text-gray-500">Cart is empty</p>
          )}
        </main>
      )}
      <Footer />
    </div>
  );
}