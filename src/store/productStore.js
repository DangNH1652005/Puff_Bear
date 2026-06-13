import instance from "../libs/axios";

export async function getProducts(params = {}) {
  const res = await instance.get("/products", { params });
  return res.data;
}

export async function getProductById(id) {
  const res = await instance.get(`/products/${id}`);
  return res.data;
}

export async function addProduct(data) {
  const payload = {
    ...data,
    price: Number(data.price),
    stock: Number(data.stock),
    sold: 0,
    createdAt: new Date().toISOString(),
  };
  const res = await instance.post("/products", payload);
  return res.data;
}

export async function updateProduct(id, data) {
  const payload = {
    ...data,
    price: Number(data.price),
    stock: Number(data.stock),
  };
  const res = await instance.put(`/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id) {
  await instance.delete(`/products/${id}`);
}

export async function getProductStats() {
  const products = await getProducts();
  return {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    lowStock: products.filter((p) => p.stock < 15).length,
    revenue: products.reduce((s, p) => s + p.price * p.sold, 0),
  };
}
