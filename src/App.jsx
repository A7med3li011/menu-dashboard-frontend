import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoutes from "./services/ProtectedRoutes";
import ReverseProtectedRoutes from "./services/ReverseProtectedRoutes";
import RoleBasedRoute from "./services/RoleBasedRoute";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import NotFound from "./pages/NotFound";

// Categories
import Categories from "./pages/Categories";
import CategoryAdd from "./components/category/CategoryAdd";
import EditCategory from "./components/category/EditCategory";
import ViewCategoryDetails from "./components/category/ViewCategoryDetails";

// Subcategories
import Subcategories from "./pages/SubCategories";
import SubcategoryAdd from "./components/subcategory/SubcategoryAdd.jsx";
import EditSubcategory from "./components/subCategory/EditSubCategory.jsx";
import ViewSubcategoryDetails from "./components/subCategory/ViewSubCategoryDetails.jsx";

// Products
import Products from "./pages/Products.jsx";
import DishAdd from "./components/dishes/DishAdd";
import EditProduct from "./components/dishes/EditProduct";

// Ingredients
import IngredientAdd from "./components/ingredients/IngredientAdd";
import EditIngredient from "./components/ingredients/EditIngredient";

// Offers
import Offer from "./pages/Offer";

// Menu Display
import MenuDisplay from "./pages/MenuDisplay";

// Reviews
import Reviews from "./pages/Reviews";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <ReverseProtectedRoutes>
          <Login />
        </ReverseProtectedRoutes>
      ),
    },
    {
      path: "",
      element: (
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
      ),
      children: [
        // Redirect root to categories
        {
          path: "/",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Categories />
            </RoleBasedRoute>
          ),
        },

        // Categories Routes
        {
          path: "/categories",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Categories />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/add-category",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <CategoryAdd />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/category/:id",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <EditCategory />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/categoryDetails/:id",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <ViewCategoryDetails />
            </RoleBasedRoute>
          ),
        },

        // Subcategories Routes
        {
          path: "/subcategories",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Subcategories />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/add-subcategory",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <SubcategoryAdd />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/subcategory/:id",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <EditSubcategory />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/subcategoryDetails/:id",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <ViewSubcategoryDetails />
            </RoleBasedRoute>
          ),
        },

        // Products Routes
        {
          path: "/products",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Products />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/add-dish",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <DishAdd />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/product/:id",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <EditProduct />
            </RoleBasedRoute>
          ),
        },

        // Ingredients Routes
        {
          path: "/add-ingredient",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <IngredientAdd />
            </RoleBasedRoute>
          ),
        },
        {
          path: "/ingredients/:id",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <EditIngredient />
            </RoleBasedRoute>
          ),
        },

        // Offers Routes
        {
          path: "/offer",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Offer />
            </RoleBasedRoute>
          ),
        },

        // Menu Display
        {
          path: "/menu",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <MenuDisplay />
            </RoleBasedRoute>
          ),
        },

        // Reviews
        {
          path: "/reviews",
          element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Reviews />
            </RoleBasedRoute>
          ),
        },

        // 404 Not Found
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
