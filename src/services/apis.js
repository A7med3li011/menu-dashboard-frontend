import axios from "axios";

// export const baseUrl = `https://admin.patriacoffeebeans.com/api/v1`;
// export const imageBase = `https://admin.patriacoffeebeans.com/uploads/`;
export const baseUrl = `http://localhost:3001/api/v1`;
export const imageBase = `http://localhost:3001/uploads/`;

// ==================== AUTHENTICATION ====================
export async function login_staff(body) {
  const { data } = await axios.post(`${baseUrl}/auth/login`, body, {});
  return data;
}

// ==================== CATEGORIES ====================
export async function getCategories(token) {
  const { data } = await axios.get(`${baseUrl}/category`, {
    headers: {
      token: `${token}`,
    },
  });
  return data?.data;
}

export async function getCategory(id, token) {
  const { data } = await axios.get(`${baseUrl}/category/${id}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function createCategory(payload, token) {
  const { data } = await axios.post(`${baseUrl}/category`, payload, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function updateCategory(id, body, token) {
  const { data } = await axios.put(`${baseUrl}/category/${id}`, body, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function deleteCategory(categoryId, token) {
  const { data } = await axios.delete(`${baseUrl}/category/${categoryId}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

// ==================== SUBCATEGORIES ====================
export async function getSubcategories(categoryId, token) {
  const { data } = await axios.get(`${baseUrl}/subcategory/category/${categoryId}/`, {
    headers: {
      token: `${token}`,
    },
  });
  return data?.data;
}

export async function createSubcategory(payload, token) {
  const { data } = await axios.post(`${baseUrl}/subcategory/`, payload, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function getAllSubcategories(token) {
  const { data } = await axios.get(`${baseUrl}/subcategory/`, {
    headers: {
      token: `${token}`,
    },
  });
  return data?.data;
}

export async function getSubcategoryById(id, token) {
  const { data } = await axios.get(`${baseUrl}/subcategory/${id}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function updateSubcategory(id, payload, token) {
  const { data } = await axios.put(`${baseUrl}/subcategory/${id}`, payload, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function deleteSubcategory(id, token) {
  const { data } = await axios.delete(`${baseUrl}/subcategory/${id}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

// ==================== PRODUCTS ====================
export async function getproducts(token) {
  const { data } = await axios.get(`${baseUrl}/product/`, {
    headers: {
      token: `${token}`,
    },
  });
  return data.data;
}

export async function getProductById(id, token) {
  const { data } = await axios.get(`${baseUrl}/product/${id}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function getproductsBysubCat(id, token) {
  const { data } = await axios.get(`${baseUrl}/product/cat/${id}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function createProduct(payload, token) {
  const { data } = await axios.post(`${baseUrl}/product`, payload, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function updateProduct(productId, body, token) {
  const { data } = await axios.put(`${baseUrl}/product/${productId}`, body, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function deleteProduct(productId, token) {
  const { data } = await axios.delete(`${baseUrl}/product/${productId}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

// ==================== PRODUCT EXTRAS ====================
export async function getAllExtras(productId, token) {
  const { data } = await axios.get(`${baseUrl}/products/${productId}/extras`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function createExtra(productId, body, token) {
  const { data } = await axios.post(
    `${baseUrl}/products/${productId}/extras`,
    body,
    {
      headers: {
        token: `${token}`,
      },
    }
  );
  return data;
}

export async function updateExtra(productId, extraId, body, token) {
  const { data } = await axios.put(
    `${baseUrl}/products/${productId}/extras/${extraId}`,
    body,
    {
      headers: {
        token: `${token}`,
      },
    }
  );
  return data;
}

export async function deleteExtra(productId, extraId, token) {
  const { data } = await axios.delete(
    `${baseUrl}/products/${productId}/extras/${extraId}`,
    {
      headers: {
        token: `${token}`,
      },
    }
  );
  return data;
}

// ==================== INGREDIENTS ====================
export async function createIngredinet(body, token) {
  const { data } = await axios.post(`${baseUrl}/ingredients`, body, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function getAllIngredinet(token) {
  const { data } = await axios.get(`${baseUrl}/ingredients`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function getIngredient(ingId, token) {
  const { data } = await axios.get(`${baseUrl}/ingredients/${ingId}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function updateIngredient(ingId, body, token) {
  const { data } = await axios.put(`${baseUrl}/ingredients/${ingId}`, body, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function deleteIngredient(ingId, token) {
  const { data } = await axios.delete(`${baseUrl}/ingredients/${ingId}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

// ==================== OFFERS ====================
export async function createOffer(body, token) {
  const { data } = await axios.post(`${baseUrl}/offers`, body, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function getOffers(token) {
  const { data } = await axios.get(`${baseUrl}/offers`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function getSpecificOffer(id, token) {
  const { data } = await axios.get(`${baseUrl}/offers/${id}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function activeOffer(offerId, token) {
  const { data } = await axios.patch(
    `${baseUrl}/offers/active/${offerId}`,
    {},
    {
      headers: {
        token: `${token}`,
      },
    }
  );
  return data;
}

export async function deActiveOffer(offerId, token) {
  const { data } = await axios.patch(
    `${baseUrl}/offers/deActive/${offerId}`,
    {},
    {
      headers: {
        token: `${token}`,
      },
    }
  );
  return data;
}
export async function getReviews(token) {
  const { data } = await axios.get(
    `${baseUrl}/review`,

    {
      headers: {
        token: `${token}`,
      },
    }
  );
  return data;
}
