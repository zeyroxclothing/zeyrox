import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      variants={itemVariants}
      className="group relative glass-panel rounded-3xl overflow-hidden p-4 border border-white/10 hover:border-white/20 transition-colors duration-500 hover:shadow-[0_20px_50px_rgba(5,17,187,0.2)]"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link to={`/product/${product.id}`} className="block overflow-hidden bg-white/5 rounded-2xl mb-5 relative z-10">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-[400px] object-cover object-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
      <div className="flex justify-between items-start px-2 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-gray-100 drop-shadow-sm">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-[11px] uppercase tracking-wider font-bold text-[#0511bb]/60 dark:text-gray-400">{product.category}</p>
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
      </div>
    </motion.div>
  );
}
