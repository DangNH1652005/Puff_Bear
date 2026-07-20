import { productStatus } from "../../../constants/productStatus.constant";

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "đ";

export default function ProductTable({
  paged,
  page,
  setPage,
  totalPages,
  PER_PAGE,
  loading,
  openView,
  openEdit,
  openDel,
  catName,
}) {
  return (
    <div className="card ap-table-card">
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "var(--pink,#f06292)" }}
            ></div>
            <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
              Đang tải dữ liệu...
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table ap-table mb-0">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Sản phẩm</th>
                  <th>Thể loại</th>
                  <th>Giá bán</th>
                  <th>Tồn kho</th>
                  <th>Đã bán</th>
                  <th>Trạng thái</th>
                  <th style={{ width: 110 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-2 d-block mb-2"></i>Không tìm
                      thấy sản phẩm nào
                    </td>
                  </tr>
                )}
                {paged.map((p, idx) => (
                  <tr key={p.id} className="ap-table-row">
                    <td className="text-muted" style={{ fontSize: 13 }}>
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={p.mainImageUrl || "https://via.placeholder.com/40"}
                          alt={p.name}
                          className="ap-product-img"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <div>
                          <div className="ap-product-name">{p.name}</div>
                          <div className="ap-product-desc">
                            {p.description?.slice(0, 38)}…
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`ap-badge-cat ap-badge-cat-${p.categoryId}`}
                      >
                        {catName(p)}
                      </span>
                    </td>
                    <td className="fw-semibold">{fmt(p.price || 0)}</td>
                    <td>
                      <span
                        className={
                          (p.stock || 0) < 15 ? "text-danger fw-semibold" : ""
                        }
                      >
                        {p.stock || 0}
                        {(p.stock || 0) < 15 && (
                          <i className="bi bi-exclamation-triangle ms-1 text-danger"></i>
                        )}
                      </span>
                    </td>
                    <td>{p.sold || 0}</td>
                    <td>
                      <span
                        className={`ap-badge-status ${
                          p.status === "active" ? "active" : "inactive"
                        }`}
                      >
                        {p.status === "active" ? "Đang bán" : "Ngừng bán"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="ap-action-btn view"
                          title="Xem"
                          onClick={() => openView(p)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="ap-action-btn edit"
                          title="Sửa"
                          onClick={() => openEdit(p)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="ap-action-btn del"
                          title="Xoá"
                          onClick={() => openDel(p)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="card-footer d-flex justify-content-between align-items-center">
          <span className="text-muted" style={{ fontSize: 13 }}>
            Trang {page} / {totalPages}
          </span>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                ‹
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <li
                key={n}
                className={`page-item ${n === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(n)}>
                  {n}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(page + 1)}>
                ›
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
