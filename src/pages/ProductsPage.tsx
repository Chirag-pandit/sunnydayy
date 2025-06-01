import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, ChevronDown, Grid3X3, List, ChevronLeft, Star, ShoppingCart, ChevronRight } from "lucide-react";

// Types
type ViewType = "grid" | "list";

interface Category {
  id: string;
  name: string;
}

interface PriceFilters {
  under50: boolean;
  between50And100: boolean;
  between100And150: boolean;
  over150: boolean;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  stock: number;
  inStock: boolean;
  isNew: boolean;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
}

// Mock data
const allProducts: Product[] = [
  {
    id: 1,
    name: "Classic Fight T-Shirt",
    category: "tshirt",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    stock: 15,
    inStock: true,
    isNew: true,
    description: "Premium cotton blend t-shirt perfect for training and casual wear.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    colors: ["Black", "White", "Red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    name: "Training Hoodie",
    category: "hoodie",
    price: 79.99,
    rating: 4.8,
    stock: 8,
    inStock: true,
    isNew: false,
    description: "Comfortable hoodie with moisture-wicking technology.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    colors: ["Black", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Fight Shorts Pro",
    category: "shorts",
    price: 49.99,
    rating: 4.7,
    stock: 12,
    inStock: true,
    isNew: false,
    description: "Professional grade fight shorts with reinforced stitching.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    colors: ["Black", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Premium Hoodie",
    category: "hoodie",
    price: 89.99,
    rating: 4.6,
    stock: 5,
    inStock: true,
    isNew: true,
    description: "Premium quality hoodie with advanced fabric technology.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    colors: ["Black", "White"],
    sizes: ["M", "L", "XL"],
  },
  {
    id: 5,
    name: "Combat T-Shirt",
    category: "tshirt",
    price: 34.99,
    rating: 4.4,
    stock: 20,
    inStock: true,
    isNew: false,
    description: "Durable t-shirt designed for intense training sessions.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    colors: ["Black", "Red", "Blue"],
    sizes: ["S", "M", "L", "XL"],
  },
];

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  view: ViewType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, view }) => {
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-md ${view === "list" ? "flex" : ""}`}>
      <Link
        to={`/products/${product.id}`}
        className={`block relative group overflow-hidden ${view === "list" ? "w-48 flex-shrink-0" : ""}`}
      >
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            view === "list" ? "w-full h-48" : "w-full h-64"
          }`}
        />
        {(product.stock <= 0 || product.inStock === false) && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <span className="bg-gray-800 text-red-500 text-sm font-bold px-4 py-2 rounded">
              {product.stock <= 0 ? "OUT OF STOCK" : "COMING SOON"}
            </span>
          </div>
        )}
      </Link>

      <div className={`p-4 ${view === "list" ? "flex-1" : ""}`}>
        <div className="flex justify-between items-start mb-2">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-medium text-gray-100 hover:text-red-500 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex space-x-2">
            {product.isNew && <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>}
            {product.originalPrice && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
            )}
          </div>
        </div>

        {view === "list" && <p className="text-gray-300 text-sm mb-3">{product.description}</p>}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="font-bold text-red-500">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center">
            <Star size={16} fill="currentColor" className="text-red-500 mr-1" />
            <span className="text-sm text-gray-300">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {view === "list" && (
          <div className="mt-4 flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              View Details
            </Link>
            <button className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition-colors">
              <ShoppingCart size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_VISIBLE_PAGES = 5;
  const ELLIPSIS = "...";

  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, ELLIPSIS, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, ELLIPSIS, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, ELLIPSIS, currentPage - 1, currentPage, currentPage + 1, ELLIPSIS, totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-white hover:bg-gray-700"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === ELLIPSIS ? (
              <span className="px-3 py-1 text-gray-500">{ELLIPSIS}</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-1 rounded-md min-w-[40px] ${
                  currentPage === page ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-white hover:bg-gray-700"
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </nav>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get("category");
  const pageParam = searchParams.get("page");

  const [products] = useState<Product[]>(allProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || "all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<ViewType>("grid");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(pageParam ? Number(pageParam) : 1);
  const [priceFilters, setPriceFilters] = useState<PriceFilters>({
    under50: false,
    between50And100: false,
    between100And150: false,
    over150: false,
  });
  const [inStockOnly, setInStockOnly] = useState(false);

  const PRODUCTS_PER_PAGE = 6;

  const categories: Category[] = [
    { id: "all", name: "All Products" },
    { id: "tshirt", name: "T-Shirts" },
    { id: "shorts", name: "Fight Shorts" },
    { id: "hoodie", name: "Hoodies" },
  ];

  // Filter products based on all criteria
  const filterProducts = useCallback(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory && activeCategory !== "all") {
      result = result.filter((product) => product.category === activeCategory);
    }

    // Filter by in-stock status
    if (inStockOnly) {
      result = result.filter((product) => product.stock > 0);
    }

    // Filter by price
    const activePriceFilters = Object.entries(priceFilters)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (activePriceFilters.length > 0) {
      result = result.filter((product) => {
        if (priceFilters.under50 && product.price < 50) return true;
        if (priceFilters.between50And100 && product.price >= 50 && product.price <= 100) return true;
        if (priceFilters.between100And150 && product.price > 100 && product.price <= 150) return true;
        if (priceFilters.over150 && product.price > 150) return true;
        return false;
      });
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...result].sort((a, b) => b.price - a.price);
      case "newest":
        return [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case "featured":
      default:
        return result;
    }
  }, [products, activeCategory, sortBy, priceFilters, inStockOnly]);

  // Handle pagination
  const paginateProducts = useCallback(
    (products: Product[], page: number) => {
      const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
      return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    },
    [PRODUCTS_PER_PAGE]
  );

  // Apply filters and sort whenever criteria change
  useEffect(() => {
    const filtered = filterProducts();
    setFilteredProducts(filtered);
    setDisplayProducts(paginateProducts(filtered, currentPage));

    // Update URL params
    const params = new URLSearchParams();
    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }
    setSearchParams(params);
  }, [activeCategory, sortBy, currentPage, priceFilters, inStockOnly, filterProducts, paginateProducts, setSearchParams]);

  // Update category and page from URL parameters
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (pageParam) {
      const page = Number(pageParam);
      if (!isNaN(page)) {
        setCurrentPage(page);
      }
    } else {
      setCurrentPage(1);
    }
  }, [categoryParam, pageParam]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setPriceFilters((prev) => ({
      ...prev,
      [id]: checked,
    }));
    setCurrentPage(1);
  };

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStockOnly(e.target.checked);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  return (
    <div className="bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-red-500 mb-6 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            {categories.find((c) => c.id === activeCategory)?.name || "All Products"}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            {/* Mobile Filter Toggle */}
            <button
              className="md:hidden flex items-center text-gray-100 bg-gray-800 px-4 py-2 rounded"
              onClick={toggleFilter}
            >
              <Filter size={18} className="mr-2" />
              Filter
              <ChevronDown
                size={18}
                className={`ml-2 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Sort & View Options */}
            <div className="flex items-center ml-auto gap-4">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-300 hidden sm:inline">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="bg-gray-800 text-gray-100 rounded border border-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="hidden md:flex bg-gray-800 rounded overflow-hidden">
                <button
                  className={`p-2 ${view === "grid" ? "bg-red-600 text-white" : "text-gray-300"}`}
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  className={`p-2 ${view === "list" ? "bg-red-600 text-white" : "text-gray-300"}`}
                  onClick={() => setView("list")}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters - Mobile */}
          {isFilterOpen && (
            <div className="md:hidden bg-gray-800 p-4 rounded mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-100">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`block w-full text-left py-2 px-3 rounded ${
                        activeCategory === category.id
                          ? "bg-red-600 text-white font-medium"
                          : "text-gray-200 hover:bg-gray-700"
                      }`}
                      onClick={() => filterByCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Price Filter */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-100">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { id: "under50", label: "Under $50" },
                    { id: "between50And100", label: "$50 - $100" },
                    { id: "between100And150", label: "$100 - $150" },
                    { id: "over150", label: "Over $150" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={id}
                        className="mr-2"
                        checked={priceFilters[id as keyof PriceFilters]}
                        onChange={handlePriceFilterChange}
                      />
                      <label htmlFor={id} className="text-gray-200">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-gray-100">Availability</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    className="mr-2"
                    checked={inStockOnly}
                    onChange={handleInStockChange}
                  />
                  <label htmlFor="inStock" className="text-gray-200">
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-gray-800 p-6 rounded sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-gray-100">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                        activeCategory === category.id
                          ? "bg-red-600 text-white font-medium"
                          : "text-gray-200 hover:bg-gray-700"
                      }`}
                      onClick={() => filterByCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Price Filter */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-100">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { id: "under50", label: "Under $50" },
                    { id: "between50And100", label: "$50 - $100" },
                    { id: "between100And150", label: "$100 - $150" },
                    { id: "over150", label: "Over $150" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={id}
                        className="mr-2"
                        checked={priceFilters[id as keyof PriceFilters]}
                        onChange={handlePriceFilterChange}
                      />
                      <label htmlFor={id} className="text-gray-200">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-100">Availability</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    className="mr-2"
                    checked={inStockOnly}
                    onChange={handleInStockChange}
                  />
                  <label htmlFor="inStock" className="text-gray-200">
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {displayProducts.length > 0 ? (
              <motion.div
                className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {displayProducts.map((product) => (
                  <motion.div key={product.id} variants={fadeInUp}>
                    <ProductCard product={product} view={view} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-100">No products found</h3>
                <p className="text-gray-300 mb-6">Try adjusting your filters or search criteria.</p>
                <button
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                  onClick={() => {
                    setActiveCategory("all");
                    setPriceFilters({
                      under50: false,
                      between50And100: false,
                      between100And150: false,
                      over150: false,
                    });
                    setInStockOnly(false);
                    setCurrentPage(1);
                  }}
                >
                  View All Products
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > PRODUCTS_PER_PAGE && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;