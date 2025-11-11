import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChefHat, Coins, ArrowLeft, Tag, Layers } from "lucide-react";
import {
  getCategory,
  getSubcategories,
  imageBase,
} from "../../services/apis.js";

const ViewCategoryDetails = () => {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((store) => store.user.token);

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token is missing. Please login again.");
      navigate("/login");
    }
  }, [token, navigate]);

  // 1. Fetch Category
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getCategory(categoryId, token),
    enabled: !!categoryId && !!token,
  });

  // --- DATA EXTRACTION ---
  const category = categoryData?.data || categoryData;

  // 2. Fetch Subcategories for this Category
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => getSubcategories(categoryId, token),
    enabled: !!categoryId && !!token,
  });

  const handleGoBack = () => navigate(-1);
  const isLoading = categoryLoading;

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/subcategory/${subcategoryId}/products`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading category details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
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
              {category?.title || "Category Details"}
            </h1>
            <div className="w-16"></div> {/* Spacer */}
          </div>

          {/* --- Category Info --- */}
          <div className="bg-popular/10 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Tag className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Category Information</h3>
            </div>
            <div className="flex items-center space-x-6">
              {category?.image && (
                <img
                  src={`${imageBase}${category.image}`}
                  alt={category.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="text-white font-medium text-lg">{category?.title}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {subcategories?.length || 0} {subcategories?.length === 1 ? 'Subcategory' : 'Subcategories'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Subcategories Grid --- */}
        <h2 className="text-2xl font-bold text-white mb-6">
          Subcategories in this Category ({subcategories?.length || 0})
        </h2>
        {subcategoriesLoading && (
          <div className="text-white text-center py-8">Loading subcategories...</div>
        )}

        {!subcategoriesLoading && (!subcategories || subcategories.length === 0) ? (
          <div className="bg-secondary rounded-lg shadow-lg p-8 text-center">
            <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Subcategories Found
            </h3>
            <p className="text-gray-400">
              There are no subcategories available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories?.map((subcategory) => (
              <div
                key={subcategory._id}
                onClick={() => handleSubcategoryClick(subcategory._id)}
                className="bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              >
                {/* Subcategory Image */}
                <div className="relative h-48 bg-gradient-to-br from-popular/20 to-popular/5">
                  {subcategory.image ? (
                    <img
                      src={`${imageBase}${subcategory.image}`}
                      alt={subcategory.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="w-16 h-16 text-popular/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white truncate">
                      {subcategory.title}
                    </h3>
                  </div>
                </div>

                {/* Subcategory Details */}
                <div className="p-4">
                  {subcategory.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {subcategory.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-popular">
                      <ChefHat className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        {subcategory.productCount || 0} Products
                      </span>
                    </div>
                    <button className="text-popular hover:text-popular/80 text-sm font-medium transition-colors">
                      View Products →
                    </button>
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

export default ViewCategoryDetails;
