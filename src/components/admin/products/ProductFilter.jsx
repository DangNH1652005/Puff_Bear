import { productStatus } from "../../../constants/productStatus.constant";

export default function ProductFilter({
  search,
  setSearch,
  setPage,
  filterCat,
  setFilterCat,
  categories,
  filterSt,
  setFilterSt,
  sortBy,
  setSortBy,
  filteredLength,
}) {
  return (
    <div className="card ap-filter-card mb-3">
      <div className="card-body">
        <div className="d-flex flex-nowrap gap-2 align-items-center" style={{ overflowX: "auto" }}>
          <div className="ap-search-box">
            <i className="bi bi-search"></i>
            <input
              placeholder="Tìm tên sản phẩm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="form-select ap-filter-select"
            value={filterCat}
            onChange={(e) => {
              setFilterCat(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tất cả Thể loại</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.type}
              </option>
            ))}
          </select>
          <select
            className="form-select ap-filter-select"
            value={filterSt}
            onChange={(e) => {
              setFilterSt(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value={productStatus.ACTIVE}>Đang bán</option>
            <option value={productStatus.INACTIVE}>Ngừng bán</option>
          </select>
          <select
            className="form-select ap-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Mặc định</option>
            <option value="price">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="stock">Tồn kho thấp</option>
            <option value="sold">Bán nhiều nhất</option>
          </select>
        </div>
        <div className="mt-2 text-end text-muted" style={{ fontSize: 13 }}>
          {filteredLength} sản phẩm
        </div>
      </div>
    </div>
  );
}
