import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Eye,
  Power,
  PowerOff,
  X,
  Upload,
  Trash2,
  AlertTriangle,
  Gift,
  Grid3X3,
  Loader2,
  TableOfContents,
} from "lucide-react";

import {
  getOffers,
  createOffer,
  getSpecificOffer,
  deActiveOffer,
  activeOffer,
  imageBase,
} from "../services/apis";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Offer Details Modal Component - Simplified for image-only offers
const OfferDetailsModal = ({
  offerId,
  isOpen,
  onClose,
  token,
}) => {
  const [offerDetails, setOfferDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && offerId) {
      fetchOfferDetails();
    }
  }, [isOpen, offerId]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      const response = await getSpecificOffer(offerId, token);
      let offerData = response.data || response;
      setOfferDetails(offerData);
    } catch (error) {
      console.error("Error fetching offer details:", error);
      toast.error("Error loading offer details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Offer Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-popular" />
            </div>
          ) : offerDetails ? (
            <div className="space-y-6">
              {/* Image */}
              {offerDetails.image && (
                <div className="text-center">
                  <img
                    src={`${imageBase}${offerDetails.image}`}
                    alt="Offer"
                    className="w-full max-w-full mx-auto rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Status */}
              <div className="text-center">
                <label className="text-sm font-medium text-gray-400 block mb-2">
                  Status
                </label>
                <p
                  className={`font-semibold text-lg ${
                    offerDetails.isActive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {offerDetails.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No offer details available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Offer Card Component - Simplified for image-only offers
const OfferCard = ({ data, onToggleStatus, onViewDetails }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    setIsToggling(true);
    if (onToggleStatus) {
      await onToggleStatus(data?._id);
    }
    setIsToggling(false);
  };

  return (
    <>
      <div className="group bg-secondary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/20 hover:border-popular/30">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-black">
          {data?.image ? (
            <img
              className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500"
              src={`${imageBase}${data.image}`}
              alt="Offer"
            />
          ) : (
            <div className="w-full h-80 bg-gray-700 flex items-center justify-center">
              <Gift className="w-16 h-16 text-gray-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>

          {/* Status badge */}
          <div
            className={`absolute top-3 right-3 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium ${
              data?.isActive ? "bg-green-500/90" : "bg-red-500/90"
            }`}
          >
            {data?.isActive ? "Active" : "Inactive"}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 space-y-3">

          {/* Action Buttons */}
          <div className="pt-2 space-y-1.5">
            <button
              onClick={() => onViewDetails && onViewDetails(data?._id)}
              className="w-full py-2 bg-popular/10 hover:bg-popular text-popular hover:text-white border border-popular/30 hover:border-popular rounded-lg font-medium text-sm transition-all duration-300"
            >
              View Offer Details
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleToggleStatus}
                disabled={isToggling}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-1 ${
                  data?.isActive
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50"
                    : "bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-500/50"
                } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isToggling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {data?.isActive ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                    <span>{data?.isActive ? "Deactivate" : "Activate"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Offer = () => {
  const [state, setState] = useState(1); // 1: View Offers, 2: Create Offer
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const offersLoaded = useRef(false);
  const token = useSelector((store) => store.user.token);

  // Form state - only image required
  const [formData, setFormData] = useState({
    image: null,
  });


  useEffect(() => {
    if (state === 1 && !offersLoaded.current) {
      loadOffers();
      offersLoaded.current = true;
    } else if (state === 1 && offersLoaded.current) {
      // Only reload if explicitly needed (like after creating an offer)
      // You can add a separate flag for this
    }
  }, [state]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await getOffers(token);

      // Handle different response structures
      let offersData = [];
      if (response?.data && Array.isArray(response.data)) {
        offersData = response.data;
      } else if (Array.isArray(response)) {
        offersData = response;
      } else if (response?.offers && Array.isArray(response.offers)) {
        offersData = response.offers;
      }
      // No mapping needed, items are already populated by backend
      setOffers(offersData);
    } catch (error) {
      console.error("Error loading offers:", error);
      setOffers([]);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        return;
      }

      // Validate file size (max 800KB)
      const maxSize = 800 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be less than 800KB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);
      const formDataObj = new FormData();
      formDataObj.append("image", formData.image);

      await createOffer(formDataObj, token);

      // Reset form
      setFormData({
        image: null,
      });
      setImagePreview(null);

      toast.success("Offer created successfully!");
      setState(1); // Switch back to view offers
      loadOffers();
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error(
        "Error creating offer: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      image: null,
    });
    setImagePreview(null);
  };


  const handleRemoveOffer = (id) => {
    setOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== id));
  };

  const handleToggleOfferStatus = async (id) => {
    // Validate token
    if (!token) {
      toast.error("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      const offer = offers.find((o) => String(o._id) === String(id));
      if (!offer) {
        toast.error("Offer not found");
        return;
      }

      let response;
      if (offer.isActive) {
        // Deactivate the offer
        response = await deActiveOffer(id, token);
      } else {
        // Activate the offer
        response = await activeOffer(id, token);
      }

      // Update local state and re-map items to product objects
      setOffers((prevOffers) =>
        prevOffers.map((offerItem) => {
          if (String(offerItem._id) === String(id)) {
            return {
              ...offerItem,
              isActive: !offerItem.isActive,
            };
          }
          return offerItem;
        })
      );

      toast.success(
        `Offer ${offer.isActive ? "deactivated" : "activated"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling offer status:", error);

      // More detailed error handling
      let errorMessage = "Error updating offer status";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleViewOfferDetails = (offerId) => {
    setSelectedOfferId(offerId);
    setShowDetailsModal(true);
  };


  return (
    <div className="min-h-screen py-8">
      {/* Tab Navigation - styled like Management.jsx */}
      <div className="flex justify-between items-center flex-wrap mb-8">
        <h3 className="font-semibold tracking-wider text-lg text-white">
          Offer Management
        </h3>
        <div className="flex items-center border-[1px] rounded-md overflow-x-auto hide-scrollbar border-popular w-full sm:w-fit max-w-full">
          <button
            onClick={() => setState(1)}
            className={`flex items-center gap-x-3 px-4 py-2 text-xs whitespace-nowrap min-w-fit ${
              state === 1 ? "bg-popular text-white" : ""
            }`}
          >
            <span>
              <TableOfContents size={15} />
            </span>
            <span>View Offers</span>
          </button>
          <button
            onClick={() => setState(2)}
            className={`flex items-center gap-x-3 px-4 py-2 text-xs whitespace-nowrap min-w-fit ${
              state === 2 ? "bg-popular text-white" : ""
            }`}
          >
            <span>
              <Plus size={15} />
            </span>
            <span>Create Offer</span>
          </button>
        </div>
      </div>

      {/* Offer Details Modal */}
      <OfferDetailsModal
        offerId={selectedOfferId}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOfferId(null);
        }}
        token={token}
      />

      {/* Tab Content */}
      {state === 1 ? (
        // View Offers
        <div className="space-y-8 mt-10">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-gray-200/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-popular/20 rounded-xl">
                  <Gift className="w-6 h-6 text-popular" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg lg:text-3xl font-bold text-white tracking-wide">
                    Offers
                  </h1>
                  <p className="text-gray-300 mt-1">
                    Manage your special offers (
                    {Array.isArray(offers) ? offers.length : 0} total)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setState(2)}
                className="bg-popular hover:bg-popular/90 text-white py-3 px-6 flex items-center gap-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span>Add Offer</span>
              </button>
            </div>
          </div>

          {/* Offers Grid */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-popular" />
                  <p className="text-gray-600 font-medium">Loading Offers...</p>
                </div>
              </div>
            ) : Array.isArray(offers) && offers.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-popular rounded-full"></div>
                    <h2 className="text-lg font-semibold text-white">
                      All Offers
                    </h2>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {offers.length} items
                  </div>
                </div>

                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                  {offers.map((offer, index) => (
                    <div
                      key={offer?._id || offer?.id || index}
                      className="transform hover:scale-[1.02] transition-transform duration-300"
                    >
                      <OfferCard
                        data={offer}
                        onDelete={handleRemoveOffer}
                        onToggleStatus={handleToggleOfferStatus}
                        onViewDetails={handleViewOfferDetails}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <Gift className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Offers Found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Get started by creating your first special offer
                    </p>
                    <button
                      onClick={() => setState(2)}
                      className="bg-popular hover:bg-popular/90 text-white py-3 px-6 flex items-center gap-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
                    >
                      <Plus size={20} />
                      <span>Create Offer</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          {Array.isArray(offers) && offers.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-popular">
                    {offers.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Offers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {offers.filter((offer) => offer?.isActive).length}
                  </p>
                  <p className="text-sm text-gray-600">Active Offers</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Create Offer Form
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r bg-popular/90 text-white px-6 py-4">
              <h1 className="text-md sm:text-lg lg:text-2xl font-bold text-white">
                Add New Offer
              </h1>
              <p className="mt-1 text-sm sm:text-base">
                Create a new special offer for your customers
              </p>
            </div>

            {/* Form */}
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload - Only Field */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Offer Image *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-popular/60 border-dashed rounded-lg hover:border-popular/80 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-64 w-auto object-cover rounded-lg shadow-md"
                          />
                          <p className="text-sm text-gray-400 mt-2">
                            {formData.image?.name}
                          </p>
                        </div>
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer bg-popular/20 rounded-md font-medium text-popular hover:text-popular/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-popular px-2 py-1"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1 text-gray-400">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF, WebP up to 800KB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-x-4 gap-y-3 flex-wrap">
                  <button
                    className="bg-popular hover:bg-popular/90 py-2 px-4 rounded-md font-semibold w-full sm:w-fit text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Offer"}
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-md font-semibold w-full sm:w-fit text-white transition-colors"
                    type="button"
                    onClick={() => setState(1)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-md font-semibold w-full sm:w-fit text-white transition-colors"
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-secondary rounded-lg p-4">
            <h3 className="text-sm font-medium text-popular mb-2">
              Instructions:
            </h3>
            <ul className="text-sm text-white space-y-1">
              <li>• Upload a clear, high-quality image for your offer</li>
              <li>• Image should be attractive and represent the offer well</li>
              <li>• Supported formats: JPG, PNG, GIF, WebP (max 800KB)</li>
              <li>• Recommended image dimensions: 1200x600 pixels or similar aspect ratio</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offer;
