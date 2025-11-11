import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoutes from "./services/ProtectedRoutes.jsx";
import ReverseProtectedRoutes from "./services/ReverseProtectedRoutes.jsx";
import RoleBasedRoute from "./services/RoleBasedRoute.jsx";
import Login from "./pages/Login.jsx";
import Layout from "./pages/Layout.jsx";
import NotFound from "./pages/NotFound.jsx";

// Categories
import Categories from "./pages/Categories.jsx";
import CategoryAdd from "./components/category/CategoryAdd.jsx";
import EditCategory from "./components/category/EditCategory.jsx";
import ViewCategoryDetails from "./components/category/ViewCategoryDetails.jsx";

// Subcategories
import Subcategories from "./pages/SubCategories.jsx";
import SubCategoryAdd from "./components/subcategory/SubCategoryAdd.jsx";
import EditSubcategory from "./components/subcategory/EditSubCategory.jsx";
import ViewSubcategoryDetails from "./components/subcategory/ViewSubCategoryDetails.jsx";

// Products
import Products from "./pages/Products.jsx";
import DishAdd from "./components/dishes/DishAdd.jsx";
import EditProduct from "./components/dishes/EditProduct.jsx";

// Ingredients
import IngredientAdd from "./components/ingredients/IngredientAdd.jsx";
import EditIngredient from "./components/ingredients/EditIngredient.jsx";

// Offers
import Offer from "./pages/Offer.jsx";

// Menu Display
import MenuDisplay from "./pages/MenuDisplay.jsx";

// Reviews
import Reviews from "./pages/Reviews.jsx";


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
              <SubCategoryAdd />
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
