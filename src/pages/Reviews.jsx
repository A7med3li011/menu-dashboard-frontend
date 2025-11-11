import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getReviews } from "../services/apis";
import { Star, MessageSquare, User, Calendar, Phone, CheckCircle, XCircle, Utensils, Sparkles } from "lucide-react";

export default function Reviews() {
  const token = useSelector((store) => store.user.token);

  // Fetch reviews
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => getReviews(token),
  });

  // Extract reviews array from the response
  const reviews = reviewsData?.data || reviewsData || [];

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const numRating = Number(rating) || 0;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= numRating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
          }`}
        />
      );
    }
    return stars;
  };

  // Calculate average rating for overall rating
  const calculateAverageRating = () => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
    const sum = reviews.reduce(
      (acc, review) => acc + Number(review.overallRating || review.rate || 0),
      0
    );
    return (sum / reviews.length).toFixed(1);
  };

  // Calculate average for specific rating type
  const calculateAverageForRating = (ratingKey) => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
    const sum = reviews.reduce(
      (acc, review) => acc + Number(review[ratingKey] || 0),
      0
    );
    return (sum / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-popular mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-lg text-red-400">Failed to load reviews</p>
          <p className="text-sm text-gray-400 mt-2">{error.message}</p>
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
            Customer Reviews
          </h1>
          <p className="text-gray-300">
            See what our customers are saying about us
          </p>
        </div>

        {/* Statistics Card */}
        {reviews && Array.isArray(reviews) && reviews.length > 0 && (
          <div className="bg-secondary rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-popular mb-2">
                  {reviews.length}
                </div>
                <div className="text-gray-300 text-sm">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-popular mb-2 flex items-center justify-center gap-2">
                  {calculateAverageRating()}
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-gray-300 text-sm">Overall Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-popular mb-2 flex items-center justify-center gap-2">
                  {calculateAverageForRating('tasteRating')}
                  <Utensils className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-gray-300 text-sm">Taste Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-popular mb-2 flex items-center justify-center gap-2">
                  {calculateAverageForRating('hygieneRating')}
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-gray-300 text-sm">Hygiene Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-popular mb-2">
                  {reviews.filter((r) => r.wouldComeBack === true).length}
                </div>
                <div className="text-gray-300 text-sm">Would Return</div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {!reviews || !Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="bg-secondary rounded-lg shadow-lg p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-400">
              Be the first to leave a review for our products!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.isArray(reviews) && reviews.map((review, index) => (
              <div
                key={index}
                className="bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Header with user info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-popular/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-popular" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {review.name || "Anonymous"}
                        </h3>
                        {review.mobileNumber && (
                          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{review.mobileNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Would Come Back Badge */}
                    {review.wouldComeBack !== undefined && (
                      <div className="flex items-center gap-1">
                        {review.wouldComeBack ? (
                          <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Would Return</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                            <XCircle className="w-3 h-3" />
                            <span>Won't Return</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ratings Section */}
                  <div className="mb-4 space-y-3">
                    {/* Overall Rating */}
                    {(review.overallRating || review.rate) && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Overall Rating:</span>
                        <div className="flex gap-1">
                          {renderStars(review.overallRating || review.rate)}
                        </div>
                      </div>
                    )}

                    {/* Taste Rating */}
                    {review.tasteRating && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Utensils className="w-4 h-4 text-orange-400" />
                          Taste:
                        </span>
                        <div className="flex gap-1">
                          {renderStars(review.tasteRating)}
                        </div>
                      </div>
                    )}

                    {/* Hygiene Rating */}
                    {review.hygieneRating && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          Hygiene:
                        </span>
                        <div className="flex gap-1">
                          {renderStars(review.hygieneRating)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Comments */}
                  {review.additionalComments && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Comments:</h4>
                      <p className="text-gray-300 text-sm leading-relaxed bg-primary/30 p-3 rounded-lg">
                        {review.additionalComments}
                      </p>
                    </div>
                  )}

                  {/* Legacy comment field for backwards compatibility */}
                  {!review.additionalComments && review.comment && (
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs pt-4 border-t border-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
