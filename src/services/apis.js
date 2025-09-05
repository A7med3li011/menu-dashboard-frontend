import axios from "axios";

export const baseUrl = `https://admin.patriacoffeebeans.com/api/v1`;
export const imageBase = `https://admin.patriacoffeebeans.com/uploads/`;
// export const baseUrl = `http://localhost:3001/api/v1`;
// export const imageBase = `http://localhost:3001/uploads/`;

export async function login_staff(body) {
  const { data } = await axios.post(`${baseUrl}/auth/login`, body, {});

  return data;
}

export async function add_staff(body, token) {
  const { data } = await axios.post(`${baseUrl}/auth/addStaff`, body, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function dashboaordmain() {
  const { data } = await axios.get(`${baseUrl}/order/stats`);

  return data;
}
export async function ordersWeekly() {
  const { data } = await axios.get(`${baseUrl}/order/weekly`);

  return data;
}
export async function ordersMonthly() {
  const { data } = await axios.get(`${baseUrl}/order/revenue/monthly`);

  return data;
}
export async function get_staff_by_id(id, token) {
  const { data } = await axios.get(`${baseUrl}/auth/getuser/${id}`, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function update_staff_by_id(id, payload, token) {
  const { data } = await axios.put(
    `${baseUrl}/auth/updateStaff/${id}`,
    payload.values,
    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function delete_staff_by_id(id, token) {
  const { data } = await axios.delete(
    `${baseUrl}/auth/staff/${id}`,

    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function add_kitchen(body, token) {
  const { data } = await axios.post(`${baseUrl}/kitchen`, body, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function get_kitchens(token) {
  const { data } = await axios.get(`${baseUrl}/kitchen`, {
    headers: {
      token: `${token}`,
    },
  });

  return data.data || [];
}
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
export async function getsubCategoryByCategorie(id, token) {
  const { data } = await axios.get(`${baseUrl}/subcategory/category/${id}`, {
    headers: {
      token: `${token}`,
    },
  });

  return data.data || [];
}
export async function getproductsBysubCat(id, token) {
  const { data } = await axios.get(`${baseUrl}/product/bysubcat/${id}`, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function getsubCategoryies(token) {
  const { data } = await axios.get(`${baseUrl}/subcategory/`, {
    headers: {
      token: `${token}`,
    },
  });

  return data.data;
}
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

export async function getAllOrdersWebsite(page, token, bool, search) {
  const data = await axios.get(
    `${baseUrl}/order/?page=${page}&from=false&search=${search || ""}`,
    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}

export async function getAllOrders(page, token, bool, search, filter) {
  const data = await axios.get(
    `${baseUrl}/order/?page=${page}&from=${bool}&search=${
      search || ""
    }&filter=${filter}`,
    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}

export async function getAllOrdersApp(page, token, bool, search) {
  const data = await axios.get(
    `${baseUrl}/order/?page=${page}&from=true&search=${search || ""}`,
    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function updateItems(id, token, items) {
  const data = await axios.put(
    `${baseUrl}/order/items/${id}`,
    {
      items,
    },
    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function getOrdersByKitchen(id, token) {
  const { data } = await axios.get(`${baseUrl}/order/getbykitchen/${id}`, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function addSection(title, token) {
  const { data } = await axios.post(
    `${baseUrl}/section/`,
    {
      title,
    },
    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function updateSection(id, title, token) {
  const { data } = await axios.put(
    `${baseUrl}/section/${id}`,
    {
      title,
    },
    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function deletedSection(id, token) {
  const { data } = await axios.delete(
    `${baseUrl}/section/${id}`,

    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function relatedTables(id, token) {
  const { data } = await axios.get(
    `${baseUrl}/section/${id}`,

    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function getSections(token) {
  const { data } = await axios.get(
    `${baseUrl}/section/`,

    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}
export async function updateOrder(id, body, token) {
  const { data } = await axios.put(`${baseUrl}/order/${id}`, body, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function updateStatusOrder(body, token) {
  const { data } = await axios.patch(`${baseUrl}/order/`, body, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function getTables(token) {
  const { data } = await axios.get(`${baseUrl}/tables`, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function updateTable(id, body, token) {
  const { data } = await axios.put(`${baseUrl}/tables/${id}`, body, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function createTable(body, token) {
  const { data } = await axios.post(`${baseUrl}/tables/`, body, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}

export async function createOrder(payload, token) {
  const { data } = await axios.post(`${baseUrl}/order`, payload, {
    headers: {
      token: `${token}`,
    },
  });
}
export async function createCategory(payload, token) {
  const { data } = await axios.post(`${baseUrl}/category`, payload, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
export async function createSubCategory(payload, token) {
  const { data } = await axios.post(`${baseUrl}/subcategory`, payload, {
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

export async function getStaff(token) {
  const { data } = await axios.get(`${baseUrl}/auth/staff`, {
    headers: {
      token: `${token}`,
    },
  });

  return data.data || [];
}

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

export async function deleteProduct(productId, token) {
  const { data } = await axios.delete(`${baseUrl}/product/${productId}`, {
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

export async function deleteSubCategory(subCategoryId, token) {
  const { data } = await axios.delete(
    `${baseUrl}/subcategory/${subCategoryId}`,
    {
      headers: {
        token: `${token}`,
      },
    }
  );

  return data;
}

export async function getSubCategoryById(subCategoryId, token) {
  const { data } = await axios.get(`${baseUrl}/subcategory/${subCategoryId}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function updateSubCategory(subCategoryId, body, token) {
  const { data } = await axios.put(
    `${baseUrl}/subCategory/${subCategoryId}`,
    body,
    {
      headers: {
        Token: `${token}`,
      },
    }
  );

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

export async function updateCategory(id, body, token) {
  const { data } = await axios.put(`${baseUrl}/category/${id}`, body, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}

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

export async function deleteIngredient(ingId, token) {
  const { data } = await axios.delete(`${baseUrl}/ingredients/${ingId}`, {
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
export async function getIngredient(ingId, token) {
  const { data } = await axios.get(`${baseUrl}/ingredients/${ingId}`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function getLocations(token) {
  const { data } = await axios.get(`${baseUrl}/location/`, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}

export async function updateLocation(id, body, token) {
  const { data } = await axios.put(`${baseUrl}/location/${id}`, body, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}
export async function mergeOrderFunction(body, token) {
  const { data } = await axios.post(`${baseUrl}/order/merge`, body, {
    headers: {
      token: `${token}`,
    },
  });
  return data;
}
