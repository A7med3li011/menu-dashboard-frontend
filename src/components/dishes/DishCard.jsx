import {
  ChefHat,
  DollarSign,
  MapPin,
  Tag,
  Star,
  Clock,
  Users,
} from "lucide-react";
import { imageBase } from "../../services/apis";

export default function DishCard({ data }) {
  // Parse ingredients if it's a string
  const parseIngredients = (ingredients) => {
    if (!ingredients || !ingredients.length) return [];
    try {
      return JSON.parse(ingredients[0]);
    } catch {
      return ingredients;
    }
  };

  const ingredientsList = parseIngredients(data?.ingredients);
  const displayIngredients = ingredientsList.slice(0, 3); // Show first 3 ingredients
  const hasMoreIngredients = ingredientsList.length > 3;

  return (
    <div className="group bg-secondary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/20 hover:border-popular/30  flex flex-col ">
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
          ${data?.price}
        </div>

        {/* Rating Badge (if you have rating data) */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>4.5</span>
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-black px-2 py-1 rounded-full text-xs font-medium">
          {data?.subCategory?.title}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className=" h-[100px]">
          <h3 className="text-xl font-bold text-white group-hover:text-popular transition-colors duration-300 leading-tight mb-2">
            {data?.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2">
            {data?.description}
          </p>
        </div>

        <div className="space-y-3  h-[250px]">
          {/* Kitchen Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-popular/20 rounded-lg group-hover:bg-popular/30 transition-colors duration-300">
              <ChefHat className="w-4 h-4 text-popular" />
            </div>
            <div className="flex-1">
              <span className="text-gray-300 text-sm font-medium">Kitchen</span>
              <p className="text-white font-semibold">{data?.kitchen?.name}</p>
            </div>
          </div>

          {/* Category */}
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
          {displayIngredients.length > 0 && (
            <div className="space-y-2">
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
                    +{ingredientsList.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {/* <div className="pt-2 space-y-2 mt-auto">
          <button className="w-full py-2 bg-popular/10 hover:bg-popular/20 text-popular border border-popular/30 hover:border-popular/50 rounded-lg font-medium text-sm transition-all duration-300">
            View Details
          </button>
        </div> */}
      </div>
    </div>
  );
}
