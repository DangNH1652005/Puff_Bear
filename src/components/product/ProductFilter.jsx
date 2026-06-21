import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { getAllColors } from "../../services/color/color.service";
import { getAllSizes } from "../../services/size/size.service";
import { getAllCollections } from "../../services/collection/collection.service";

function ProductFilter({
  filters,
  setFilters,
}) {
  const [collections, setCollections] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [collectionData, sizeData, colorData] =
      await Promise.all([
        getAllCollections(),
        getAllSizes(),
        getAllColors(),
      ]);

    setCollections(collectionData);
    setSizes(sizeData);
    setColors(colorData);
  };

  const clearFilter = () => {
    setFilters({
      collectionId: "",
      sizeId: "",
      colorIds: [],
      maxPrice: 500000,
    });
  };

  return (
    <div className="product-filter">

      <h3 className="filter-title">
        Bộ lọc
      </h3>

      {/* COLLECTION */}
      <div className="filter-section">
        <h5>Bộ sưu tập</h5>

        <Form.Check
          type="radio"
          label="Tất cả"
          checked={filters.collectionId === ""}
          onChange={() =>
            setFilters({
              ...filters,
              collectionId: "",
            })
          }
        />

        {collections.map((item) => (
          <Form.Check
            key={item.id}
            type="radio"
            label={item.name}
            checked={
              filters.collectionId === item.id
            }
            onChange={() =>
              setFilters({
                ...filters,
                collectionId: item.id,
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
              className={`size-btn ${filters.sizeId === size.id
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
        className="clear-filter-btn"
        onClick={clearFilter}
      >
        Xóa bộ lọc
      </Button>

    </div>
  );
}

export default ProductFilter;
