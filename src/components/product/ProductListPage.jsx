import { useEffect, useState } from "react";

import ProductFilter from "../../components/product/ProductFilter";
import ProductCard from "../../components/public/ProductCard";

import { getAllProducts } from "../../services/product/product.service";

function ProductListPage() {
  const [products, setProducts] =
    useState([]);

  const [filters, setFilters] =
    useState({
      collectionId: "",
      sizeId: "",
      colorIds: [],
      maxPrice: 500000,
    });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getAllProducts();

    setProducts(
      data.filter(
        (item) =>
          item.status === "active"
      )
    );
  };

  const filteredProducts =
    products.filter((product) => {
      if (
        filters.collectionId &&
        product.collectionId !==
        filters.collectionId
      ) {
        return false;
      }

      if (
        filters.sizeId &&
        !product.sizeIds.includes(
          filters.sizeId
        )
      ) {
        return false;
      }

      if (
        filters.colorIds.length > 0 &&
        !filters.colorIds.some((c) =>
          product.colorIds.includes(c)
        )
      ) {
        return false;
      }

      if (
        product.price >
        filters.maxPrice
      ) {
        return false;
      }

      return true;
    });

  return (
    <div className="container py-5">

      <div className="row">

        <div className="col-lg-3">

          <ProductFilter
            filters={filters}
            setFilters={setFilters}
          />

        </div>

        <div className="col-lg-9">

          <h5 className="mb-4">
            {filteredProducts.length}
            {" "}sản phẩm
          </h5>

          <div className="row">

            {filteredProducts.map(
              (product) => (
                <div
                  className="col-lg-4 col-md-6 mb-4"
                  key={product.id}
                >
                  <ProductCard
                    product={product}
                  />
                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductListPage;
