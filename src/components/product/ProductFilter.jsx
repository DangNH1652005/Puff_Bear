import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  getCategories,
  getColors,
  getSizes,
} from "../../services/product/productService";

function ProductFilter({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoryData, sizeData, colorData] =
        await Promise.all([
          getCategories(),
          getSizes(),
          getColors(),
        ]);

      setCategories(categoryData);
      setSizes(sizeData);
      setColors(colorData);
    } catch (error) {
      console.error(error);
    }
  };

  const clearFilter = () => {
    setFilters({
      categoryId: "",
      sizeId: "",
      colorIds: [],
      maxPrice: 1000000,
    });
  };

  return (
    <div className="product-filter">
      <h3 className="filter-title">
        Bộ lọc
      </h3>

      {/* CATEGORY */}
      <div className="filter-section">
        <h5>Thể loại</h5>

        <Form.Check
          type="radio"
          name="category"
          label="Tất cả"
          checked={filters.categoryId === ""}
          onChange={() =>
            setFilters({
              ...filters,
              categoryId: "",
            })
          }
        />

        {categories.map((item) => (
          <Form.Check
            key={item.id}
            type="radio"
            name="category"
            label={item.name}
            checked={
              filters.categoryId === item.id
            }
            onChange={() =>
              setFilters({
                ...filters,
                categoryId: item.id,
              })
            }
          />
        ))}
      </div>

      {/* SIZE */}
      <div className="filter-section">
        <h5>Kích thước</h5>

        <div className="size-container">
          {sizes.map((size) => (
            <button
              key={size.id}
              className={`size-btn ${
                filters.sizeId === size.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilters({
                  ...filters,
                  sizeId:
                    filters.sizeId === size.id
                      ? ""
                      : size.id,
                })
              }
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR */}
      <div className="filter-section">
        <h5>Màu sắc</h5>

        {colors.map((color) => (
          <Form.Check
            key={color.id}
            type="checkbox"
            label={color.name}
            checked={filters.colorIds.includes(
              color.id
            )}
            onChange={() => {
              const exists =
                filters.colorIds.includes(
                  color.id
                );

              setFilters({
                ...filters,
                colorIds: exists
                  ? filters.colorIds.filter(
                      (c) => c !== color.id
                    )
                  : [
                      ...filters.colorIds,
                      color.id,
                    ],
              });
            }}
          />
        ))}
      </div>

      {/* PRICE */}
      <div className="filter-section">
        <h5>Giá tiền</h5>

        <Form.Range
          min={0}
          max={1000000}
          step={50000}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({
              ...filters,
              maxPrice: Number(
                e.target.value
              ),
            })
          }
        />

        <div className="price-labels">
          <span>0đ</span>

          <span>
            {filters.maxPrice.toLocaleString()}
            đ
          </span>
        </div>
      </div>

      <Button
        variant="outline-secondary"
        className="w-100 clear-filter-btn"
        onClick={clearFilter}
      >
        Xóa bộ lọc
      </Button>
    </div>
  );
}

export default ProductFilter;