/** @jsxImportSource @emotion/react */
import Link from "next/link";
import styled from "@emotion/styled";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useCartStore from "../../stores/cartStore";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #f0f4ff 0%, #f9fafb 100%);
  padding: 2rem 2rem 3rem 2rem; // Added left & right spacing
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2.5rem;
  color: #1e293b;
  letter-spacing: -1px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // 4 products per row
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const ProductCard = styled.div`
  background: linear-gradient(120deg, #fff 60%, #e0e7ff 100%);
  border-radius: 14px;
  padding: 1.2rem 1rem 1rem 1rem;
  box-shadow: 0 4px 16px rgba(30, 41, 59, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.16s, box-shadow 0.16s;
  min-width: 0;

  &:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 8px 24px rgba(30, 41, 59, 0.13);
    background: linear-gradient(120deg, #e0e7ff 0%, #fff 100%);
  }
`;

const ProductImage = styled(Image)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.06);
  background: #f1f5f9;
  width: 110px !important;
  height: 110px !important;
  object-fit: contain;
`;

const ProductName = styled.h2`
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0.3rem 0 0.2rem;
  color: #1e293b;
`;

const ProductDescription = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.4rem;
  min-height: 20px;
  max-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProductPrice = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.7rem;
  display: block;
`;

const AddToCartButton = styled.button`
  background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: auto;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
  transition: background 0.18s, transform 0.13s;

  &:hover {
    background: linear-gradient(90deg, #1e40af 60%, #2563eb 100%);
    transform: scale(1.04);
  }
`;

const HeaderSpacer = styled.div`
  height: 2.5rem;
`;

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
  rating?: { rate: number; count: number };
};

export default function Products({ products = [] }: { products: Product[] }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <PageWrapper>
      <Header />
      <HeaderSpacer /> {/* Add spacing below header like home page */}
      <Title>All Products</Title>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <Link
              href={`/products/${product.id}`}
              style={{ textDecoration: "none", width: "100%" }}
            >
              <ProductImage
                src={product.image}
                alt={product.name}
                width={110}
                height={110}
              />
              <ProductName>{product.name}</ProductName>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  marginBottom: 2,
                  fontStyle: "italic",
                }}
              >
                {product.category}
              </p>
              <ProductDescription>{product.description}</ProductDescription>
              <ProductPrice>{product.price}</ProductPrice>
              {product.rating && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#eab308",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="currentColor"
                    style={{ display: "inline-block" }}
                  >
                    <path d="M7 10.5l-4.33 2.28.83-4.84L.5 4.72l4.87-.7L7 0l1.63 4.02 4.87.7-3.5 3.22.83 4.84z" />
                  </svg>
                  {product.rating.rate} ({product.rating.count})
                </span>
              )}
            </Link>
            <AddToCartButton
              onClick={() => addToCart({ ...product, quantity: 1 })}
            >
              Add to Cart
            </AddToCartButton>
          </ProductCard>
        ))}
      </ProductGrid>
      <Footer />
    </PageWrapper>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");

    if (!res.ok) throw new Error("Failed to fetch products");

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

    return {
      props: {
        products,
      },
      revalidate: 60, // ISR: Regenerate every 60 seconds
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        products: [],
      },
    };
  }
}
