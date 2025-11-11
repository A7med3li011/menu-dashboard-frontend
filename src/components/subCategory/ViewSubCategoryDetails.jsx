import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChefHat, Coins, ArrowLeft, Tag, FolderTree } from "lucide-react";
import {
  getSubcategoryById,
  getproductsBysubCat,
  imageBase,
} from "../../services/apis.js";

const ViewSubcategoryDetails = () => {
  const { id: subcategoryId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((store) => store.user.token);

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token is missing. Please login again.");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch subcategory data
  const { data: subcategoryData, isLoading: subcategoryLoading } = useQuery({
    queryKey: ["subcategory", subcategoryId],
    queryFn: () => getSubcategoryById(subcategoryId, token),
    enabled: !!subcategoryId && !!token,
  });

  // --- DATA EXTRACTION ---
  const subcategory = subcategoryData?.data || subcategoryData;

  // Fetch products for this subcategory
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products-by-subcategory", subcategoryId],
    queryFn: () => getproductsBysubCat(subcategoryId, token),
    enabled: !!subcategoryId && !!token,
  });

  const products = productsData?.data || productsData || [];

  const handleGoBack = () => navigate(-1);
  const isLoading = subcategoryLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading subcategory details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-secondary rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleGoBack}
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-white text-center flex-1">
              {subcategory?.title || "Subcategory Details"}
            </h1>
            <div className="w-16"></div>
          </div>

          {/* --- Subcategory Info --- */}
          <div className="bg-popular/10 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FolderTree className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Subcategory Information</h3>
            </div>
            <div className="flex items-center space-x-6">
              {subcategory?.image && (
                <img
                  src={`${imageBase}${subcategory.image}`}
                  alt={subcategory.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="text-white font-medium text-lg">{subcategory?.title}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Parent Category: {subcategory?.category?.title || 'N/A'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {products?.length || 0} {products?.length === 1 ? 'Product' : 'Products'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">
          Products in this Subcategory ({products?.length || 0})
        </h2>
        {productsLoading && (
          <div className="text-white text-center py-8">Loading products...</div>
        )}

        {!productsLoading && (!products || products.length === 0) ? (
          <div className="bg-secondary rounded-lg shadow-lg p-8 text-center">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Products Found
            </h3>
            <p className="text-gray-400">
              There are no products available in this subcategory.
            </p>
            <button
              onClick={() => navigate('/add-dish')}
              className="mt-4 bg-popular hover:bg-popular/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
              <div
                key={product._id}
                className="bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="relative h-48 bg-gray-300">
                  {product.image ? (
                    <img
                      src={`${imageBase}${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-600">
                      <ChefHat className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.available
                          ? "bg-popular text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 truncate">
                      {product.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    {product.kitchen && (
                      <div className="flex items-center text-white text-sm mb-3">
                        <ChefHat className="w-4 h-4 mr-1" />
                        <span>{product.kitchen.name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-popular font-semibold">
                        <Coins className="w-4 h-4 mr-1" />
                        <span>{product.price} EG</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-white text-sm font-medium mb-1">
                          Ingredients:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {product.ingredients
                            .slice(0, 3)
                            .map((ingredient, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-popular/10 text-popular text-xs rounded-full"
                              >
                                {ingredient}
                              </span>
                            ))}
                          {product.ingredients.length > 3 && (
                            <span className="px-2 py-1 bg-popular/10 text-gray-300 text-xs rounded-full">
                              +{product.ingredients.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {product.extras && product.extras.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center justify-center w-5 h-5 bg-popular/20 rounded-md">
                            <svg
                              className="w-3 h-3 text-popular"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <h4 className="text-white text-sm font-semibold">
                            Available Extras ({product.extras.length})
                          </h4>
                        </div>
                        <div className="space-y-1.5">
                          {product.extras.slice(0, 3).map((extra) => (
                            <div
                              key={extra._id}
                              className="flex items-center justify-between bg-gradient-to-r from-popular/10 to-popular/5 hover:from-popular/15 hover:to-popular/10 px-2.5 py-1.5 rounded-lg border border-popular/20 hover:border-popular/30 transition-all duration-200 group"
                            >
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <div className="w-1 h-1 rounded-full bg-popular flex-shrink-0"></div>
                                <span className="text-white text-xs font-medium truncate group-hover:text-popular transition-colors">
                                  {extra.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                <span className="text-popular text-xs font-bold">
                                  +{extra.price}
                                </span>
                                <span className="text-popular/70 text-[10px] font-medium">
                                  EG
                                </span>
                              </div>
                            </div>
                          ))}
                          {product.extras.length > 3 && (
                            <div className="text-center pt-0.5">
                              <span className="text-xs text-gray-400 bg-gray-700/30 px-2.5 py-0.5 rounded-full">
                                +{product.extras.length - 3} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-600 pt-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-400">
                          <span className="font-medium">Status:</span>
                          <span
                            className={`ml-1 ${
                              product.available
                                ? "text-popular"
                                : "text-red-400"
                            }`}
                          >
                            {product.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                        <div className="text-gray-400">
                          <span className="font-medium">Price:</span>
                          <span className="ml-1 text-popular">
                            {product.price} EG
                          </span>
                        </div>
                        {product.ingredients && (
                          <div className="text-gray-400 col-span-2">
                            <span className="font-medium">Ingredients:</span>
                            <span className="ml-1">
                              {product.ingredients.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSubcategoryDetails;
