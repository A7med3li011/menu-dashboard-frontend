import axios from "axios";

export const baseUrl = `http://localhost:3001/api/v1`;
export const imageBase = `http://localhost:3001/uploads/`;

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
  console.log(payload.values);
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
  console.log(body);
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
export async function getOrdersByKitchen(id, token) {
  const { data } = await axios.get(`${baseUrl}/order/getbykitchen/${id}`, {
    headers: {
      token: `${token}`,
    },
  });

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

export async function getAllExtras(token) {
  const { data } = await axios.get(`${baseUrl}/products/:productId/extras`, {
    headers: {
      token: `${token}`,
    },
  });

  return data;
}
