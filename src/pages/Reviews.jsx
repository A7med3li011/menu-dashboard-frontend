import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getReviews } from "../services/apis";
import { Star, MessageSquare, User, Calendar } from "lucide-react";

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

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
    const sum = reviews.reduce(
      (acc, review) => acc + Number(review.rate || 0),
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="text-gray-300 text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-popular mb-2">
                  {reviews.filter((r) => Number(r.rate) >= 4).length}
                </div>
                <div className="text-gray-300 text-sm">Positive Reviews</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="flex gap-1 mt-1">
                          {renderStars(review.rate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {review.comment || "No comment provided"}
                    </p>
                  </div>

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
