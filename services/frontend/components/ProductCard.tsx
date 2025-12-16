import Link from 'next/link';
import { Heart } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  goldPurity: string;
  vendor: {
    shopName: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images && product.images.length > 0 
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`
    : '/placeholder-gold.jpg';

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.vendor.shopName}</p>
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-gold-600">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">عیار {product.goldPurity}</p>
              <p className="font-bold text-lg">
                {product.price.toLocaleString('fa-IR')} تومان
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
