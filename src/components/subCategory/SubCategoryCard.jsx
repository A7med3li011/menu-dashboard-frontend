import { TableOfContents, Utensils } from "lucide-react";
import { imageBase } from "../../services/apis";

export default function SubCategoryCard({ data }) {
  return (
    <div className="group bg-secondary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/20 hover:border-popular/30">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
          src={`${imageBase}${data?.image}`}
          alt={data?.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>

        {/* Floating badge */}
        <div className="absolute top-3 right-3 bg-popular/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
          New
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 space-y-4">
        <h3 className="text-xl font-bold text-white group-hover:text-popular transition-colors duration-300 leading-tight">
          {data?.title}
        </h3>

        <div className="space-y-3">
          {/* Sub Categories */}

          {/* Products */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-popular/20 rounded-lg group-hover:bg-popular/30 transition-colors duration-300">
              <Utensils className="w-4 h-4 text-popular" />
            </div>
            <div className="flex-1">
              <span className="text-gray-300 text-sm font-medium">
                Products
              </span>
              <p className="text-white font-semibold">{data?.products}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {/* <div className="pt-2">
          <button className="w-full py-2.5 bg-popular/10 hover:bg-popular text-popular hover:text-white border border-popular/30 hover:border-popular rounded-lg font-medium text-sm transition-all duration-300 group-hover:translate-y-0 translate-y-1">
            Explore Category
          </button>
        </div> */}
      </div>
    </div>
  );
}
