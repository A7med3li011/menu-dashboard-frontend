import React, { useState } from "react";
import {
  ChefHat,
  DollarSign,
  MapPin,
  Tag,
  Star,
  Clock,
  Users,
  X,
  AlertTriangle,
} from "lucide-react";
import { imageBase, deleteProduct } from "../../services/apis";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Add this import
import { toast } from "react-toastify";

export default function DishCard({ data, onDelete }) {
  const token = useSelector((store) => store.user.token);
  const navigate = useNavigate(); // Add this hook
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Parse ingredients if it's a string
  const parseIngredients = (ingredients) => {
    if (!ingredients || !ingredients.length) return [];
    try {
      return JSON.parse(ingredients[0]);
    } catch {
      return ingredients;
    }
  };

  // Parse extras
  const parseExtras = (extras) => {
    if (!extras) return [];
    if (Array.isArray(extras)) return extras;
    if (typeof extras === "string") {
      try {
        return JSON.parse(extras);
      } catch {
        return [];
      }
    }
    return [];
  };

  const ingredientsList = parseIngredients(data?.ingredients);
  const displayIngredients = ingredientsList.slice(0, 5); // Show first 5 ingredients
  const hasMoreIngredients = ingredientsList.length > 5;
  const extrasList = parseExtras(data?.extras);
  const displayExtras = extrasList.slice(0, 3); // Show first 3 extras
  const hasMoreExtras = extrasList.length > 3;

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleEditClick = () => {
    // Navigate to edit page with product ID
    navigate(`/product/${data?._id || data?.id}`);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    if (onDelete) {
      onDelete(data?.id || data?._id);
    }
    try {
      await deleteProduct(data?._id, token);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Error deleting product:", error);
    }
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="group bg-secondary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/20 hover:border-popular/30 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
            src={`${imageBase}${data?.image}`}
            alt={data?.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-all duration-300"></div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-popular/90 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold text-sm">
            {data?.price} {"EG"}
          </div>

          {/* Rating Badge (if you have rating data) */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>4.5</span>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-black px-2 py-1 rounded-full text-xs font-medium">
            {data?.category?.title}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 space-y-4 flex-1 flex flex-col">
          <div className="">
            <h3 className="text-xl font-bold text-white group-hover:text-popular transition-colors duration-300 leading-tight mb-2">
              {data?.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2">
              {data?.description?.slice(0, 30)}...
            </p>
          </div>

          <div className="space-y-3  h-[180px]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-popular/20 rounded-lg group-hover:bg-popular/30 transition-colors duration-300">
                <Tag className="w-4 h-4 text-popular" />
              </div>
              <div className="flex-1">
                <span className="text-gray-300 text-sm font-medium">
                  Category
                </span>
                <p className="text-white font-semibold">
                  {data?.category?.title}
                </p>
              </div>
            </div>

            {/* Ingredients Preview */}
            <div className="space-y-2 min-h-[80px]">
              {displayIngredients.length > 0 ? (
                <>
                  <span className="text-gray-300 text-sm font-medium">
                    Main Ingredients
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {displayIngredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-popular/10 text-popular px-2 py-1 rounded-full text-xs font-medium border border-popular/20"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {hasMoreIngredients && (
                      <span className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                        +{ingredientsList.length - 5} more
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No ingredients listed
                </div>
              )}
            </div>

            {/* Extras Section */}
            {/* <div className="space-y-2 pt-3 border-t border-gray-700/50 min-h-[140px]">
              {displayExtras.length > 0 ? (
                <>
                  <span className="text-gray-300 text-sm font-medium flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-popular"
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
                    Available Extras
                  </span>
                  <div className="space-y-1">
                    {displayExtras.map((extra, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gradient-to-r from-popular/10 to-popular/5 hover:from-popular/20 hover:to-popular/10 px-3 py-2 rounded-lg border border-popular/20 hover:border-popular/30 transition-all duration-200"
                      >
                        <span className="text-white text-xs font-medium">
                          {extra.name}
                        </span>
                        <span className="text-popular text-xs font-bold bg-popular/10 px-2 py-1 rounded-full">
                          +{extra.price} EG
                        </span>
                      </div>
                    ))}
                    {hasMoreExtras && (
                      <div className="text-center">
                        <span className="text-gray-400 text-xs font-medium bg-gray-600/20 px-3 py-1 rounded-full inline-block">
                          +{extrasList.length - 3} more extras
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No extras available
                </div>
              )}
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex space-x-2 mt-auto">
            <button
              onClick={handleEditClick}
              className="w-full py-2 bg-popular/10 hover:bg-blue-800/20 text-popular hover:text-blue-400 border border-popular/30 hover:border-blue-500/50 rounded-lg font-medium text-sm transition-all duration-300"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-full py-2 bg-popular/10 hover:bg-red-500/20 text-popular hover:text-red-400 border border-popular/30 hover:border-red-500/50 rounded-lg font-medium text-sm transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Portal to center of page */}
      {showDeleteConfirm && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          style={{
            zIndex: 99999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div
            className="bg-secondary border border-gray-700 rounded-xl p-6 shadow-2xl"
            style={{
              width: "500px",
              maxWidth: "90vw",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Delete Product
                </h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete this product?
              </p>
              <p className="text-white font-medium mb-2">{data?.title}</p>
              <p className="text-red-400 text-sm">
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg font-medium text-sm transition-all duration-300"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2 px-4 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 hover:text-white border border-gray-600/30 hover:border-gray-500/50 rounded-lg font-medium text-sm transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
