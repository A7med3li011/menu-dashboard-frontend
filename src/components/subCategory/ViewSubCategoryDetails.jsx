import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChefHat, DollarSign, ArrowLeft, Tag, Layers } from "lucide-react";
import {
  getproductsBysubCat,
  getSubCategoryById,
  getCategories,
  imageBase,
} from "../../services/apis.js";

const ViewSubCategoryDetails = () => {
  const { id } = useParams(); // subcategory ID from URL
  const navigate = useNavigate();
  const token = useSelector((store) => store.user.token);

  // Check token validity
  useEffect(() => {
    if (!token || typeof token !== "string" || token.trim() === "") {
      toast.error("Authentication token is missing. Please login again.");
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  // Fetch all categories to get parent category details
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token),
    enabled: !!token,
    onError: (error) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    },
  });

  // Fetch subcategory details
  const {
    data: subCategoryData,
    isLoading: subCategoryLoading,
    error: subCategoryError,
  } = useQuery({
    queryKey: ["subcategory", id],
    queryFn: () => getSubCategoryById(id, token),
    enabled: !!id && !!token,
    onError: (error) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    },
  });

  // Fetch products by subcategory
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products-by-subcategory", id],
    queryFn: () => getproductsBysubCat(id, token),
    enabled: !!id && !!token,
    onError: (error) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    },
  });

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Loading state
  if (!token) {
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="text-white text-lg">Checking authentication...</div>
      </div>
    );
  }

  if (subCategoryLoading || productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  // Error state
  if (subCategoryError || productsError || categoriesError) {
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="text-red-400 text-lg">
          Failed to load data:{" "}
          {subCategoryError?.message ||
            productsError?.message ||
            categoriesError?.message ||
            "Unknown error"}
        </div>
      </div>
    );
  }

  const subCategory = subCategoryData?.data || subCategoryData;
  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  // Find parent category
  const parentCategory = categories.find(
    (cat) =>
      cat._id === subCategory?.category?._id ||
      cat._id === subCategory?.category
  );
  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-secondary rounded-lg shadow-lg p-6 mb-8">
          {/* Breadcrumb Navigation */}
          {parentCategory && (
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <Layers className="w-4 h-4 mr-2" />
              <span className="hover:text-white transition-colors cursor-pointer">
                {parentCategory.title}
              </span>
              <span className="mx-2">›</span>
              <span className="text-white font-medium">
                {subCategory?.title}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleGoBack}
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-white text-center flex-1">
              {subCategory?.title || "Subcategory Dashboard"}
            </h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>

          {/* Category and Subcategory Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Parent Category Card */}
            {parentCategory && (
              <div className="bg-popular/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Tag className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">
                    Parent Category
                  </h3>
                </div>
                <div className="flex items-center space-x-4">
                  {parentCategory.image && (
                    <img
                      src={`${imageBase}${parentCategory.image}`}
                      alt={parentCategory.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {parentCategory.title}
                    </p>
                    <p className="text-gray-400 text-sm">Main Category</p>
                  </div>
                </div>
              </div>
            )}

            {/* Subcategory Card */}
            <div className="bg-popular/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Layers className="w-5 h-5 text-popular mr-2" />
                <h3 className="text-lg font-semibold text-white">
                  Current Subcategory
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                {subCategory?.image && (
                  <img
                    src={`${imageBase}${subCategory.image}`}
                    alt={subCategory.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="text-white font-medium">{subCategory?.title}</p>
                  <p className="text-gray-400 text-sm">
                    {products.length}{" "}
                    {products.length === 1 ? "product" : "products"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-popular/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {products.length}
              </div>
              <div className="text-popular text-sm">Total Products</div>
            </div>
            <div className="bg-popular/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {products.filter((p) => p.available).length}
              </div>
              <div className="text-popular text-sm">Available</div>
            </div>
            <div className="bg-popular/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {products.filter((p) => !p.available).length}
              </div>
              <div className="text-popular text-sm">Unavailable</div>
            </div>
            <div className="bg-popular/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {
                  new Set(products.map((p) => p.kitchen?.name).filter(Boolean))
                    .size
                }
              </div>
              <div className="text-popular text-sm">Kitchens</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-secondary rounded-lg shadow-lg p-8 text-center">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Products Found
            </h3>
            <p className="text-gray-400">
              There are no products available in this subcategory at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
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

                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.available
                          ? "bg-popular text-white"
                          : "bg-white text-white"
                      }`}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {product.title}
                  </h3>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Kitchen Info */}
                  {product.kitchen && (
                    <div className="flex items-center text-white text-sm mb-3">
                      <ChefHat className="w-4 h-4 mr-1" />
                      <span>{product.kitchen.name}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-popular font-semibold">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>{product.price} EG</span>
                    </div>
                  </div>

                  {/* Ingredients */}
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

                  {/* Extras */}
                  {product.extras && product.extras.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-white text-sm font-medium mb-1">
                        Extras:
                      </h4>
                      <div className="space-y-1">
                        {product.extras.slice(0, 2).map((extra) => (
                          <div
                            key={extra._id}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-gray-300">{extra.name}</span>
                            <span className="text-popular">
                              +{extra.price} EG
                            </span>
                          </div>
                        ))}
                        {product.extras.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{product.extras.length - 2} more extras
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Product Info Summary */}
                  <div className="border-t border-gray-600 pt-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-400">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-1 ${
                            product.available ? "text-popular" : "text-red-400"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSubCategoryDetails;
