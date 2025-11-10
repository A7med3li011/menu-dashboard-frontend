import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getProductById,
  updateProduct,
  getCategories,
  imageBase,
} from "../../services/apis";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Upload, X, Plus, Minus } from "lucide-react";

// Dynamic schema - simplified for existing images
const createProductSchema = (isEdit, hasExistingImage) =>
  Yup.object({
    title: Yup.string()
      .required("Product title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must not exceed 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must not exceed 500 characters"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive")
      .min(0.01, "Price must be at least $0.01"),
    priceAfterDiscount: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value))
      .positive("Price after discount must be positive")
      .min(0.01, "Price after discount must be at least 0.01")
      .max(9999.99, "Price after discount cannot exceed 9999.99")
      .test(
        "less-than-price",
        "Price after discount must be less than original price",
        function (value) {
          if (!value) return true; // Optional field
          return value < this.parent.price;
        }
      ),
    category: Yup.string().required("Category is required"),
    ingredients: Yup.array()
      .min(1, "At least one ingredient must be added")
      .required("Ingredients are required"),
    extras: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string()
            .required("Extra name is required")
            .min(1, "Extra name must be at least 1 character")
            .max(50, "Extra name must not exceed 50 characters")
            .trim(),
          price: Yup.number()
            .required("Extra price is required")
            .positive("Price must be positive")
            .min(0.01, "Price must be at least 0.01")
            .max(999.99, "Price cannot exceed 999.99")
        })
      )
      .max(10, "Maximum 10 extras allowed"),
    image: Yup.mixed().test(
      "image-required",
      "Product image is required",
      function (value) {
        // For create mode, always require image
        if (!isEdit) {
          return (
            !!value && (value instanceof File || typeof value === "object")
          );
        }
        // For edit mode, image is optional if there's an existing image
        if (hasExistingImage) {
          return true; // Existing image is fine
        }
        // No existing image, so require a new one
        return !!value && (value instanceof File || typeof value === "object");
      }
    ),
  });

export default function EditProduct() {
  const [imagePreview, setImagePreview] = useState(null);
  const [newIngredient, setNewIngredient] = useState("");
  const [hasNewImage, setHasNewImage] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [existingImagePath, setExistingImagePath] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [validationSchema, setValidationSchema] = useState(null);
  const { id } = useParams();
  const token = useSelector((store) => store.user.token);
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Initialize validation schema
  useEffect(() => {
    const schema = createProductSchema(isEdit, hasExistingImage);
    setValidationSchema(schema);
  }, [isEdit, hasExistingImage]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      priceAfterDiscount: "",
      category: "",
      ingredients: [],
      extras: [],
      image: null,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();

      // Append all form fields
      Object.keys(values).forEach((key) => {
        if (key === "ingredients") {
          const ingredientsArray = Array.isArray(values[key])
            ? values[key]
            : [];
          formData.append(key, JSON.stringify(ingredientsArray));
        } else if (key === "extras") {
          // Handle extras array - send as JSON string
          if (values[key] && values[key].length > 0) {
            formData.append(key, JSON.stringify(values[key]));
          }
        } else if (key === "image") {
          // Only append image if a new one was selected and it's a valid File object
          if (hasNewImage && values[key] && values[key] instanceof File) {
            formData.append(key, values[key]);
          }
          // If keeping existing image, append the path
          else if (!hasNewImage && existingImagePath) {
            formData.append("imagePath", existingImagePath);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      // Debug: Log FormData contents safely

      updateMutation.mutate({ id, formData });
    },
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token),
  });

  // Fetch product data for editing
  const {
    data: productData,
    isLoading: productLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id, token),
    enabled: isEdit && !!id,

    onError: (error) => {
      console.error("Error fetching product:", error);
    },
  });

  // Populate form when product data is loaded
  useEffect(() => {
    if (productData && isEdit) {
      try {
        const product = productData.data || productData;

        let ingredients = [];
        if (product.ingredients) {
          if (Array.isArray(product.ingredients)) {
            if (
              product.ingredients.length === 1 &&
              typeof product.ingredients[0] === "string"
            ) {
              try {
                const parsed = JSON.parse(product.ingredients[0]);
                if (Array.isArray(parsed)) {
                  ingredients = parsed;
                } else {
                  ingredients = product.ingredients;
                }
              } catch (error) {
                console.warn("Failed to parse ingredients as JSON:", error);
                ingredients = product.ingredients;
              }
            } else {
              ingredients = product.ingredients;
            }
          } else if (typeof product.ingredients === "string") {
            try {
              const parsed = JSON.parse(product.ingredients);
              if (Array.isArray(parsed)) {
                ingredients = parsed;
              } else {
                ingredients = [product.ingredients];
              }
            } catch (error) {
              console.warn("Failed to parse ingredients JSON:", error);
              ingredients = [product.ingredients];
            }
          } else {
            ingredients = [product.ingredients];
          }
        }

        // Handle extras parsing
        let extras = [];
        if (product.extras) {
          if (Array.isArray(product.extras)) {
            extras = product.extras;
          } else if (typeof product.extras === "string") {
            try {
              const parsed = JSON.parse(product.extras);
              if (Array.isArray(parsed)) {
                extras = parsed;
              }
            } catch (error) {
              console.warn("Failed to parse extras as JSON:", error);
            }
          }
        }

        // Handle existing image with proper error handling
        if (product.image && typeof product.image === "object") {
          // Handle case where image is an object with filename property
          if (product.image.filename) {
            setHasExistingImage(true);
            setExistingImagePath(product.image.filename);
            const fullImageUrl = `${imageBase}${product.image.filename}`;
            setOriginalImageUrl(fullImageUrl);
            setImagePreview(fullImageUrl);
            setHasNewImage(false);
            formik.setFieldValue("image", "EXISTING_IMAGE_PLACEHOLDER");
          }
        } else if (typeof product.image === "string") {
          // Handle case where image is just a string path

          setHasExistingImage(true);
          setExistingImagePath(product.image);
          const fullImageUrl = `${imageBase}${product.image}`;
          setOriginalImageUrl(fullImageUrl);
          setImagePreview(fullImageUrl);
          setHasNewImage(false);
          formik.setFieldValue("image", "EXISTING_IMAGE_PLACEHOLDER");
        } else {
          setHasExistingImage(false);
          setExistingImagePath(null);
          setOriginalImageUrl(null);
          setImagePreview(null);
          setHasNewImage(false);
          formik.setFieldValue("image", null);
        }

        // Set all form values with safe defaults
        formik.setValues({
          title: product.title || "",
          description: product.description || "",
          price: product.price || "",
          priceAfterDiscount: product.priceAfterDiscount || "",
          category: product.category?._id || "",
          ingredients: ingredients,
          extras: extras,
          image: product.image ? "EXISTING_IMAGE_PLACEHOLDER" : null,
        });
      } catch (error) {
        console.error("Error populating form with product data:", error);
        toast.error("Failed to load product data properly");
      }
    }
  }, [productData, isEdit]);

  // Update validation when originalImageUrl changes
  useEffect(() => {
    if (formik.errors.image && originalImageUrl) {
      formik.setFieldError("image", undefined);
    }
    formik.validateForm();
  }, [originalImageUrl, hasNewImage]);

  // Update product mutation
  const updateMutation = useMutation({
    mutationKey: ["update-product"],
    mutationFn: ({ id, formData }) => updateProduct(id, formData, token),
    onSuccess: () => {
      toast.success("Product updated successfully");
      navigate("/products");
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update product");
    },
  });

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file instanceof File) {
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

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      formik.setFieldValue("image", file);
      setHasNewImage(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        toast.error("Failed to read the image file");
        console.error("FileReader error");
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No valid file selected");
    }
  };

  // Handle removing image
  const handleRemoveImage = () => {
    if (hasNewImage) {
      // If user uploaded a new image, remove it and go back to original
      if (hasExistingImage && originalImageUrl) {
        setImagePreview(originalImageUrl);
        formik.setFieldValue("image", "EXISTING_IMAGE_PLACEHOLDER");
      } else {
        setImagePreview(null);
        formik.setFieldValue("image", null);
      }
      setHasNewImage(false);
    } else if (hasExistingImage) {
      // If removing original image, clear everything
      setImagePreview(null);
      setOriginalImageUrl(null);
      setHasExistingImage(false);
      setExistingImagePath(null);
      formik.setFieldValue("image", null);
      setHasNewImage(false);
    }

    // Reset file input safely
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle adding ingredients
  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      const updatedIngredients = [
        ...formik.values.ingredients,
        newIngredient.trim(),
      ];
      formik.setFieldValue("ingredients", updatedIngredients);
      setNewIngredient("");
    }
  };

  // Handle removing ingredients
  const handleRemoveIngredient = (index) => {
    const updatedIngredients = formik.values.ingredients.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("ingredients", updatedIngredients);
  };

  // Handle adding extras
  const handleAddExtra = () => {
    if (formik.values.extras.length < 10) {
      const newExtras = [...formik.values.extras, { name: "", price: "" }];
      formik.setFieldValue("extras", newExtras);
    }
  };

  // Handle removing extras
  const handleRemoveExtra = (index) => {
    const newExtras = formik.values.extras.filter((_, i) => i !== index);
    formik.setFieldValue("extras", newExtras);
  };

  // Handle updating extras
  const handleUpdateExtra = (index, field, value) => {
    const newExtras = [...formik.values.extras];
    newExtras[index][field] = value;
    formik.setFieldValue("extras", newExtras);
  };

  // Handle cancel with modal
  const handleCancel = () => {
    setShowCancelModal(true);
  };

  // Cancel modal handlers
  const cancelCancel = () => {
    setShowCancelModal(false);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate("/products");
  };

  // Loading state
  if (isEdit && productLoading) {
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading product data...</div>
      </div>
    );
  }

  // Error state
  if (isEdit && error) {
    console.error("Product loading error:", error);
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="text-red-400 text-lg">
          Failed to load product data: {error?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-secondary rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Product Image{" "}
                {!isEdit && <span className="text-red-400">*</span>}
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-800 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {imagePreview ? "Change Image" : "Choose Image"}
                  </label>
                </div>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title={hasNewImage ? "Remove new image" : "Remove image"}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Image status indicators */}
              {hasNewImage && (
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  New image selected - will replace current image
                </p>
              )}
              {originalImageUrl && !hasNewImage && (
                <p className="text-blue-400 text-sm mt-1 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Using current product image
                </p>
              )}
              {!originalImageUrl && !hasNewImage && isEdit && (
                <p className="text-yellow-400 text-sm mt-1 flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  No image set - please upload an image
                </p>
              )}

              {formik.touched.image && formik.errors.image && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.image}
                </p>
              )}
            </div>

            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-white font-medium mb-2"
              >
                Product Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-popular ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter product title"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.title}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-white font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-popular resize-none ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter product description"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.description}
                </p>
              )}
            </div>

            {/* Price Field */}
            <div>
              <label
                htmlFor="price"
                className="block text-white font-medium mb-2"
              >
                Price ($)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-popular ${
                  formik.touched.price && formik.errors.price
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter price"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.price}
                </p>
              )}
            </div>

            {/* Price After Discount Field */}
            <div>
              <label
                htmlFor="priceAfterDiscount"
                className="block text-white font-medium mb-2"
              >
                Price After Discount ($) - Optional
              </label>
              <input
                id="priceAfterDiscount"
                name="priceAfterDiscount"
                type="number"
                step="0.01"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.priceAfterDiscount}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-popular ${
                  formik.touched.priceAfterDiscount &&
                  formik.errors.priceAfterDiscount
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter discounted price"
              />
              {formik.touched.priceAfterDiscount &&
                formik.errors.priceAfterDiscount && (
                  <p className="text-red-400 text-sm mt-1">
                    {formik.errors.priceAfterDiscount}
                  </p>
                )}
              <p className="text-gray-400 text-xs mt-1">
                Leave empty if no discount is applied
              </p>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-white font-medium mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-popular ${
                  formik.touched.category && formik.errors.category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Choose category
                </option>
                {categoriesData?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.category}
                </p>
              )}
            </div>

            {/* Ingredients Section */}
            <div>
              <label className="block text-white font-medium mb-2">
                Ingredients
              </label>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddIngredient())
                  }
                  placeholder="Add an ingredient"
                  className="flex-1 px-4 py-2 rounded-lg border-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-popular border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-4 py-2 bg-popular hover:bg-opacity-90 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {formik.values.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-popular/10 p-2 rounded-lg"
                  >
                    <span className="flex-1 text-white">{ingredient}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {formik.touched.ingredients && formik.errors.ingredients && (
                <p className="text-red-400 text-sm mt-2">
                  {formik.errors.ingredients}
                </p>
              )}
            </div>

            {/* Extras Section */}
            <div>
              <label className="block text-white font-medium mb-2">
                Extras ({formik.values.extras.length}/10) - Optional
              </label>

              <div className="space-y-3">
                {formik.values.extras.map((extra, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          value={extra.name}
                          onChange={(e) => handleUpdateExtra(index, "name", e.target.value)}
                          onBlur={formik.handleBlur}
                          placeholder={`Extra name ${index + 1}`}
                          className={`w-full px-4 py-2 rounded-lg border-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-popular ${
                            formik.touched.extras?.[index]?.name &&
                            formik.errors.extras?.[index]?.name
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {formik.touched.extras?.[index]?.name &&
                          formik.errors.extras?.[index]?.name && (
                            <p className="text-red-400 text-xs mt-1">
                              {formik.errors.extras[index].name}
                            </p>
                          )}
                      </div>
                      <div>
                        <input
                          type="number"
                          value={extra.price}
                          onChange={(e) => handleUpdateExtra(index, "price", e.target.value)}
                          onBlur={formik.handleBlur}
                          placeholder="Price"
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-2 rounded-lg border-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-popular ${
                            formik.touched.extras?.[index]?.price &&
                            formik.errors.extras?.[index]?.price
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {formik.touched.extras?.[index]?.price &&
                          formik.errors.extras?.[index]?.price && (
                            <p className="text-red-400 text-xs mt-1">
                              {formik.errors.extras[index].price}
                            </p>
                          )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(index)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddExtra}
                disabled={formik.values.extras.length >= 10}
                className="mt-3 px-4 py-2 bg-popular hover:bg-opacity-90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Extra
              </button>

              {formik.touched.extras && formik.errors.extras && (
                <div className="mt-2">
                  {typeof formik.errors.extras === "string" && (
                    <p className="text-red-400 text-sm">
                      {formik.errors.extras}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white tracking-widest font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 bg-popular hover:bg-opacity-90 text-white tracking-widest font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-popular disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Cancel
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel? All unsaved changes will be
                lost.
              </p>{" "}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={confirmCancel}
                  className="px-6 py-2 bg-popular hover:bg-popular text-white font-medium rounded-lg transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={cancelCancel}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
