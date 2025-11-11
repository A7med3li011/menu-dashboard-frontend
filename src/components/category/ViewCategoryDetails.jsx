import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChefHat, Coins, ArrowLeft, Tag, Layers, FolderTree } from "lucide-react";
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

  // 2. Fetch Subcategories for this category
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => getSubcategories(categoryId, token),
    enabled: !!categoryId && !!token,
  });

  const handleGoBack = () => navigate(-1);
  const isLoading = categoryLoading;

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
            <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Subcategories Found
            </h3>
            <p className="text-gray-400">
              There are no subcategories available in this category.
            </p>
            <button
              onClick={() => navigate('/add-subcategory')}
              className="mt-4 bg-popular hover:bg-popular/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add Subcategory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* ================================================================== */}
            {/* --- START: Subcategory Card JSX --- */}
            {/* ================================================================== */}
            {subcategories?.map((subcategory) => (
              <div
                key={subcategory._id}
                className="bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-700/20 hover:border-popular/30"
              >
                {/* Subcategory Image */}
                <div className="relative h-48 bg-gray-700 overflow-hidden">
                  {subcategory.image ? (
                    <img
                      src={`${imageBase}${subcategory.image}`}
                      alt={subcategory.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-600">
                      <FolderTree className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>

                  {/* Floating badge */}
                  <div className="absolute top-3 right-3 bg-popular/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                    Subcategory
                  </div>
                </div>

                {/* Subcategory Details */}
                <div className="p-5 flex flex-col flex-grow space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-popular transition-colors duration-300 leading-tight">
                    {subcategory.title}
                  </h3>

                  <div className="space-y-3">
                    {/* Category */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-popular/20 rounded-lg group-hover:bg-popular/30 transition-colors duration-300">
                        <Tag className="w-4 h-4 text-popular" />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-300 text-sm font-medium">
                          Parent Category
                        </span>
                        <p className="text-white font-semibold">
                          {subcategory.category?.title || category?.title}
                        </p>
                      </div>
                    </div>

                    {/* Products count */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-popular/20 rounded-lg group-hover:bg-popular/30 transition-colors duration-300">
                        <ChefHat className="w-4 h-4 text-popular" />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-300 text-sm font-medium">
                          Products
                        </span>
                        <p className="text-white font-semibold">
                          {subcategory.products || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-1.5 mt-auto">
                    <button
                      onClick={() => navigate(`/subcategoryDetails/${subcategory._id}`)}
                      className="w-full py-2 bg-popular/10 hover:bg-popular text-popular hover:text-white border border-popular/30 hover:border-popular rounded-lg font-medium text-sm transition-all duration-300"
                    >
                      View Products
                    </button>
                    <button
                      onClick={() => navigate(`/subcategory/${subcategory._id}`)}
                      className="w-full py-2 bg-popular/10 hover:bg-blue-800/20 text-popular hover:text-blue-400 border border-popular/30 hover:border-blue-500/50 rounded-lg font-medium text-sm transition-all duration-300"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* ================================================================== */}
            {/* --- END: Subcategory Card JSX --- */}
            {/* ================================================================== */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCategoryDetails;
