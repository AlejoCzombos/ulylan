export const getProductById = async (productId: string, token: string) => {
  const response = await fetch(`/api/productos/${productId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getAllProducts = async () => {
  const response = await fetch(`/api/productos`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const createProduct = async (productData: any, token: string) => {
  const response = await fetch(`/api/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return response;
};

export const updateProduct = async (productId: string, productData: any, token: string) => {
  const response = await fetch(`/api/productos/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return response;
};

export const deleteProduct = async (productId: string, token: string) => {
  const response = await fetch(`/api/productos/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
