import React, { useState } from "react";
import {
  Check,
  X,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder, getTables, imageBase } from "../../services/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const OrderTracking = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate("");
  const token = useSelector((store) => store.user.token);
  const { data: tableList } = useQuery({
    queryKey: ["get-tables"],
    queryFn: () => getTables(token),
  });

  const location = useLocation();
  const { state } = location;
  let { data } = state;

  console.log(data);

  const handleCancelOrder = () => {
    setSelectedTable(null);
    setOrderConfirmed(false);
    navigate("/make-order");
  };

  let newOrder = {
    orderType: "dine-in",
  };
  if (selectedTable) {
    newOrder.table = selectedTable;
  }
  if (data.length) {
    newOrder.items = data.map((ele) => ({
      product: ele._id,
      quantity: ele.quantity,
      notes: ele.notes,
      customizations: ele.customizations ?? {},
    }));
  }

  const { mutate } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: (payload) => createOrder(payload.data, token),
    onSuccess: () => {
      navigate("/orders-tables");
      toast.success("order created successfully");
      data = [];
    },
  });

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Order Confirmed!
          </h2>
          <p className="text-sm sm:text-base text-white mb-2">
            Your order has been placed successfully
          </p>
          <p className="text-base sm:text-lg font-semibold text-green-600 mb-3 sm:mb-4">
            Table #{selectedTable}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            Estimated preparation time: 15 min : 20 min
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-orange-500 text-white py-2.5 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
          >
            Place New Order
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = data.reduce(
    (acc, item) => acc + +item.price * +item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-secondary">
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Confirm Order & Select Table
            </h1>
            <p className="text-sm sm:text-base text-white">
              Review your order and choose an available table
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {/* Order Summary */}
            {/* <div className="order-2 xl:order-1 rounded-xl shadow-lg p-4 sm:p-6 bg-secondary border border-popular">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" />
                Order Summary
              </h2>

             
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-64 sm:max-h-80 overflow-y-auto">
                {data?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg border border-gray-200"
                  >
                    <img
                      src={`${imageBase}/${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-white">
                        Quantity: {item.quantity}
                      </p>
                      {item.customizations?.extras?.length > 0 && (
                        <p className="text-xs text-orange-600 mt-1 truncate">
                          +{item.customizations.extras.join(", ")}
                        </p>
                      )}
                      {item.customizations?.removal?.length > 0 && (
                        <p className="text-xs text-orange-600 mt-1 truncate">
                          -{item.customizations.removal.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-white text-sm sm:text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

             
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-white">Subtotal:</span>
                  <span className="font-medium text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-white">VAT (20%):</span>
                  <span className="font-medium text-white">
                    ${(totalPrice * 0.2).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold border-t border-gray-200 pt-2">
                  <span className="text-white">Total:</span>
                  <span className="text-green-600">
                    ${(totalPrice * 1.2).toFixed(2)}
                  </span>
                </div>
              </div>

            
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg flex items-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-blue-800 text-xs sm:text-sm">
                  Estimated preparation time: 15-20 min
                </span>
              </div>
            </div>*/}

            {/* Table Selection */}
            <div className="order-1 xl:order-2 bg-secondary border border-popular rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Select Table
              </h2>

              {/* Legend */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-white">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-white">Occupied</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-white">Reserved</span>
                  </div>
                </div>
              </div>

              {/* Restaurant Layout */}
              <div className="relative bg-secondary rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
                <div className="text-center text-white text-xs sm:text-sm mb-4 font-medium">
                  Restaurant Floor Plan
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {tableList?.data?.map((table, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (table.status !== "Available") {
                          toast.error(`Table is ${table.status}`);
                          return;
                        } else {
                          setSelectedTable(table._id);
                        }
                      }}
                      className={`relative aspect-square transition-all duration-300 ${
                        selectedTable === table._id
                          ? "transform scale-105 z-10"
                          : "hover:scale-102"
                      } border-2 sm:border-4 rounded-lg overflow-hidden ${
                        table.status === "Available"
                          ? "border-green-500 cursor-pointer hover:border-green-400"
                          : table.status === "Occupied"
                          ? "border-red-500 cursor-not-allowed opacity-75"
                          : "border-yellow-500 cursor-not-allowed opacity-75"
                      }`}
                    >
                      <img
                        src={`${imageBase}/${table.image}`}
                        alt={`Table ${table.title}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-1 sm:p-2">
                        <p className="text-center font-semibold text-xs sm:text-sm truncate">
                          {table.title}
                        </p>
                      </div>
                      {selectedTable === table._id && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                          <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 bg-white rounded-full p-1" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={handleCancelOrder}
              className="order-2 sm:order-1 px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Cancel Order</span>
            </button>

            <button
              onClick={async () => {
                setIsLoading(true);
                await mutate({ data: newOrder });
                setIsLoading(false);
              }}
              disabled={isLoading}
              // disabled={!selectedTable}
              className={`order-1 sm:order-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base ${
                selectedTable
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Confirming...</span>
                </>
              ) : (
                <span>Confirm Order</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
