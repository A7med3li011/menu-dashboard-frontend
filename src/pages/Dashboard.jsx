import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  Star,
  Clock,
  ChefHat,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboaordmain, ordersMonthly, ordersWeekly } from "../services/apis";

export default function Dashboard() {
  // Sample data for charts

  const { data, isLoading } = useQuery({
    queryKey: ["dash_1"],
    queryFn: dashboaordmain,
  });
  const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
    queryKey: ["dash_2"],
    queryFn: ordersWeekly,
  });
  const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
    queryKey: ["dash_3"],
    queryFn: ordersMonthly,
  });

  const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

  const StatCard = ({ icon: Icon, title, value, change, color = "purple" }) => {
    const colorClasses = {
      purple: "bg-purple-500 text-white",
      cyan: "bg-cyan-500 text-white",
      emerald: "bg-emerald-500 text-white",
      amber: "bg-amber-500 text-white",
    };

    return (
      <div className="bg-[#FFBC0F] rounded-xl shadow-lg p-6 border border-gray-800 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">
                {change}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Restaurant Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back! Here's what's happening at your restaurant today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`${data?.revenue || 0} EG`}
            color="purple"
          />
          <StatCard
            icon={ShoppingBag}
            title="Orders Today"
            value={data?.todayOrderCount || 0}
            color="cyan"
          />
          <StatCard
            icon={Users}
            title="Active Customers"
            value={data?.countOfCustomer || 0}
            color="emerald"
          />
          <StatCard
            icon={Star}
            title="All Orders"
            value={data?.allRodersCount}
            color="amber"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-[#FFBC0F] rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Revenue Overview
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#374151" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Orders Chart */}
          <div className="bg-[#FFBC0F] rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Weekly Orders
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#374151" }} />
                <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ fill: "#06B6D4", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Dishes */}
          <div className="lg:col-span-2 bg-[#FFBC0F] rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">
              Popular Dishes
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {data?.data.map((dish, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <span className="text-sm text-gray-600">{dish.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#FFBC0F] rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">
              Quick Stats
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-900 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white"># Operators</p>
                    <p className="text-sm text-gray-600">
                      {data?.countOperators}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-900 rounded-lg">
                    <ChefHat className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white"># Chefs</p>
                    <p className="text-sm text-gray-600">{data?.countStaff}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-900 rounded-lg">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Waiters</p>
                    <p className="text-sm text-gray-600">{data?.countWaiter}</p>
                  </div>
                </div>
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-900 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Growth Rate</p>
                    <p className="text-sm text-gray-400">+15.3% this month</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
