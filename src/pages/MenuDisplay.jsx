import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  getCategories,
  getproducts,
  imageBase,
} from "../services/apis";
import { Search, Filter, X } from "lucide-react";

export default function MenuDisplay() {
  const token = useSelector((store) => store.user.token);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch data
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getproducts(token),
  });

  // Filter products based on selected filters
  useEffect(() => {
    if (!products) return;

    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category?._id === selectedCategory
      );
    }

    // Filter by title search
    if (searchTitle.trim()) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTitle]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory("");
    setSearchTitle("");
  };

  const hasActiveFilters = selectedCategory || searchTitle;

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-popular mx-auto"></div>
          <p className="mt-4 text-lg">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Menu Display
          </h1>
          <p className="text-gray-300">
            Browse and filter our complete menu
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-secondary rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-popular" />
              <h2 className="text-xl font-semibold text-white">Filters</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search by Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Product
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-popular focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-popular focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-sm text-gray-300">
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
                {searchTitle && ` matching "${searchTitle}"`}
                {selectedCategory &&
                  ` in ${
                    categories?.find((c) => c._id === selectedCategory)?.title
                  }`}
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-secondary rounded-lg shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">No products found</p>
              <p className="mt-2">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-700">
                  {product.image ? (
                    <img
                      src={`${imageBase}${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-popular text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                    {product.price?.toFixed(2)} EG
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                    {product.title}
                  </h3>

                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {product.description || "No description available"}
                  </p>

                  {/* Category Tag */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.category && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded">
                        {product.category?.title || "Category"}
                      </span>
                    )}
                  </div>

                  {/* Ingredients */}
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div className="border-t border-gray-600 pt-3">
                      <p className="text-xs font-medium text-gray-400 mb-2">
                        Ingredients:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {product.ingredients.slice(0, 3).map((ing, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                          >
                            {ing}
                          </span>
                        ))}
                        {product.ingredients.length > 3 && (
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            +{product.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Extras */}
                  {product.extras && product.extras.length > 0 && (
                    <div className="border-t border-gray-600 pt-3 mt-3">
                      <p className="text-xs font-medium text-gray-400 mb-2">
                        Available Extras:
                      </p>
                      <div className="space-y-1">
                        {product.extras.map((extra, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-700/30 px-2 py-1 rounded"
                          >
                            <span className="text-xs text-gray-200">
                              {extra.name}
                            </span>
                            <span className="text-xs text-popular font-semibold">
                              +{extra.price?.toFixed(2)} EG
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Products Count */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-400">
            <p>
              Displaying {filteredProducts.length} of {products?.length} total
              products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
