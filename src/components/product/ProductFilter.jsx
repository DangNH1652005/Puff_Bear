import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { Filter } from "lucide-react";

import { getAllColors } from "../../services/color/color.service";
import { getAllSizes } from "../../services/size/size.service";
import { getAllCategories } from "../../services/category/category.service";

function ProductFilter({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadData();
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadData = async () => {
    try {
    
    const [categoryData, sizeData, colorData] =
      await Promise.all([
        getAllCategories(),
        getAllSizes(),
        getAllColors(),
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
    <div className="product-filter p-3 p-lg-4 bg-white rounded-4 shadow-sm mb-4 mb-md-0">
      <div 
        className="d-flex justify-content-between align-items-center"
        style={{ cursor: window.innerWidth < 768 ? "pointer" : "default" }}
        onClick={() => {
          if (window.innerWidth < 768) setIsOpen(!isOpen);
        }}
      >
        <h3 className="filter-title mb-0 mb-md-4">Bộ lọc</h3>
        <button className="btn btn-light d-md-none p-2 rounded-circle border">
          <Filter size={18} />
        </button>
      </div>

      <Collapse in={isOpen}>
        <div>
          <div className="pt-3 pt-md-0">
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
                  label={item.type}
                  checked={filters.categoryId === item.id}
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

              <div className="size-container d-flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    className={`size-btn ${filters.sizeId === size.id ? "active" : ""}`}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        sizeId: filters.sizeId === size.id ? "" : size.id,
                      })
                    }
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div className="filter-section">
              <h5>Màu sắc</h5>

              <div className="d-flex flex-column gap-1">
                {colors.map((color) => (
                  <Form.Check
                    key={color.id}
                    type="checkbox"
                    label={color.name}
                    checked={filters.colorIds.includes(color.id)}
                    onChange={() => {
                      const exists = filters.colorIds.includes(color.id);
                      setFilters({
                        ...filters,
                        colorIds: exists
                          ? filters.colorIds.filter((c) => c !== color.id)
                          : [...filters.colorIds, color.id],
                      });
                    }}
                  />
                ))}
              </div>
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
                    maxPrice: Number(e.target.value),
                  })
                }
              />

              <div className="price-labels d-flex justify-content-between text-muted small mt-1">
                <span>0đ</span>
                <span>{filters.maxPrice.toLocaleString()}đ</span>
              </div>
            </div>

            <Button
              variant="outline-secondary"
              className="w-100 clear-filter-btn rounded-pill mt-3"
              onClick={clearFilter}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
}

export default ProductFilter;
