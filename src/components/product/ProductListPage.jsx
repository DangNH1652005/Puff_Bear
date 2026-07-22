import { useEffect, useState } from "react";

import ProductFilter from "../../components/product/ProductFilter";
import ProductCard from "../../components/public/ProductCard";

import { getAllProducts } from "../../services/product/product.service";
import { productStatus } from "../../constants/productStatus.constant";

function ProductListPage() {
  const [products, setProducts] = useState([]);

  console.log(products);

  const [filters, setFilters] = useState({
    categoryId: "",
    sizeId: "",
    colorIds: [],
    maxPrice: 500000,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getAllProducts();

    setProducts(data.filter((item) => item.status === productStatus.ACTIVE));
  };

  const filteredProducts = products.filter((product) => {
    if (filters.categoryId && product.categoryId !== filters.categoryId) {
      return false;
    }

    if (filters.sizeId && !product.sizeId.includes(filters.sizeId)) {
      return false;
    }

    if (
      filters.colorIds.length > 0 &&
      !filters.colorIds.some((colorId) => product.colorId.includes(colorId))
    ) {
      return false;
    }

    if (product.price > filters.maxPrice) {
      return false;
    }

    return true;
  });

  return (
    <div className="container py-5">
      <div className="row">
        {/* Bộ lọc (Filter Sidebar) */}
        <div className="col-12 col-md-4 col-lg-3">
          <ProductFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Danh sách sản phẩm (Product Grid) */}
        <div className="col-12 col-md-8 col-lg-9">
          <h5 className="mb-4 fw-semibold">
            {filteredProducts.length} sản phẩm
          </h5>

          <div className="row">
            {filteredProducts.map((product) => (
              <div className="col-12 col-sm-6 col-lg-4 mb-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;
