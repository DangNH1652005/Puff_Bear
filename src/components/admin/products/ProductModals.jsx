const fmt = (n) => Number(n).toLocaleString("vi-VN") + "đ";

export default function ProductModals({
  modalMode,
  closeModal,
  selected,
  catName,
  sizes,
  colors,
  form,
  setForm,
  errors,
  setErrors,
  handleChange,
  handleSubmit,
  handleDelete,
  saving,
  categories,
}) {
  return (
    <div className="modal fade" id="productModal" tabIndex="-1">
      <div
        className={`modal-dialog ${
          modalMode === "view" ? "modal-lg" : ""
        } modal-dialog-centered`}
      >
        <div className="modal-content ap-modal">
          <div className="modal-header ap-modal-header">
            <h5 className="modal-title">
              {modalMode === "add" && (
                <>
                  <i className="bi bi-plus-circle me-2"></i>Thêm sản phẩm
                </>
              )}
              {modalMode === "edit" && (
                <>
                  <i className="bi bi-pencil-square me-2"></i>Chỉnh sửa sản
                  phẩm
                </>
              )}
              {modalMode === "view" && (
                <>
                  <i className="bi bi-eye me-2"></i>Chi tiết sản phẩm
                </>
              )}
              {modalMode === "delete" && (
                <>
                  <i className="bi bi-trash me-2"></i>Xoá sản phẩm
                </>
              )}
            </h5>
            <button className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {modalMode === "delete" && (
              <div className="text-center py-3">
                <div className="ap-delete-icon mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h6>Bạn có chắc muốn xoá?</h6>
                <p className="text-muted mb-0">
                  Sản phẩm <strong>"{selected?.name}"</strong> sẽ bị xoá vĩnh
                  viễn.
                </p>
              </div>
            )}
            {modalMode === "view" && selected && (
              <div className="row g-3">
                <div className="col-md-4 text-center">
                  <img
                    src={selected.mainImageUrl || "https://via.placeholder.com/200"}
                    alt={selected.name}
                    className="ap-view-img"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200";
                    }}
                  />
                  <span
                    className={`ap-badge-status ${
                      selected.status === "active" ? "active" : "inactive"
                    } d-inline-block mt-2`}
                  >
                    {selected.status === "active" ? "Đang bán" : "Ngừng bán"}
                  </span>
                </div>
                <div className="col-md-8">
                  <h5 className="fw-bold mb-1">{selected.name}</h5>
                  <span className="ap-badge-cat mb-3 d-inline-block">
                    {catName(selected)}
                  </span>
                  <p className="text-muted">{selected.description}</p>
                  <div className="row g-2 mt-1">
                    {[
                      { label: "Giá bán", value: fmt(selected.price) },
                      { label: "Tồn kho", value: selected.stock },
                      { label: "Đã bán", value: selected.sold || 0 },
                    ].map((r) => (
                      <div className="col-6" key={r.label}>
                        <div className="ap-view-stat">
                          <div className="ap-view-stat-val">{r.value}</div>
                          <div className="ap-view-stat-label">{r.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="mb-2">
                      <strong className="text-dark" style={{ fontSize: 14 }}>
                        Kích thước:
                      </strong>{" "}
                      <span className="text-muted" style={{ fontSize: 14 }}>
                        {(selected.sizeId || [])
                          .map(
                            (id) =>
                              sizes.find((s) => s.id === id)?.name || "N/A"
                          )
                          .join(", ") || "—"}
                      </span>
                    </div>
                    <div>
                      <strong className="text-dark" style={{ fontSize: 14 }}>
                        Màu sắc:
                      </strong>{" "}
                      <span className="text-muted" style={{ fontSize: 14 }}>
                        {(selected.colorId || [])
                          .map(
                            (id) =>
                              colors.find((c) => c.id === id)?.name || "N/A"
                          )
                          .join(", ") || "—"}
                      </span>
                    </div>
                    {selected.imageUrl && selected.imageUrl.length > 0 && (
                      <div className="mt-3">
                        <strong className="text-dark" style={{ fontSize: 14 }}>
                          Ảnh phụ:
                        </strong>
                        <div className="d-flex gap-2 mt-2 flex-wrap">
                          {selected.imageUrl.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Phụ ${i + 1}`}
                              className="ap-img-preview"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {(modalMode === "add" || modalMode === "edit") && (
              <div className="row g-3">
                {/* Tên sản phẩm */}
                <div className="col-12">
                  <label className="ap-label">Tên sản phẩm *</label>
                  <input
                    className={`form-control ap-input ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    name="name"
                    value={form.name}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[<>]/g, "");
                      handleChange({
                        target: {
                          name: "name",
                          value,
                        },
                      });
                    }}
                    placeholder="VD: Gấu Teddy Brown Size L"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Giá bán */}
                <div className="col-md-6">
                  <label className="ap-label">Giá bán (VNĐ) *</label>
                  <input
                    className={`form-control ap-input ${
                      errors.price ? "is-invalid" : ""
                    }`}
                    name="price"
                    type="number"
                    min={1}
                    max={100000000}
                    value={form.price}
                    onChange={handleChange}
                    placeholder="450000"
                  />
                  {errors.price && (
                    <div className="invalid-feedback">{errors.price}</div>
                  )}
                </div>

                {/* Tồn kho */}
                <div className="col-md-6">
                  <label className="ap-label">Tồn kho *</label>
                  <input
                    className={`form-control ap-input ${
                      errors.stock ? "is-invalid" : ""
                    }`}
                    name="stock"
                    type="number"
                    min={0}
                    max={1000}
                    step={1}
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="50"
                  />
                  {errors.stock && (
                    <div className="invalid-feedback">{errors.stock}</div>
                  )}
                </div>

                {/* Thể loại */}
                <div className="col-md-6">
                  <label className="ap-label">Thể loại *</label>
                  <select
                    className={`form-select ap-input ${
                      errors.categoryId ? "is-invalid" : ""
                    }`}
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn thể loại --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.type}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <div className="invalid-feedback">{errors.categoryId}</div>
                  )}
                </div>

                {/* Trạng thái */}
                <div className="col-md-6">
                  <label className="ap-label">Trạng thái</label>
                  <select
                    className="form-select ap-input"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">Đang bán</option>
                    <option value="inactive">Ngừng bán</option>
                  </select>
                </div>

                {/* URL hình ảnh */}
                <div className="col-12">
                  <label className="ap-label">URL hình ảnh *</label>
                  <input
                    className={`form-control ap-input ${
                      errors.mainImageUrl ? "is-invalid" : ""
                    }`}
                    name="mainImageUrl"
                    value={form.mainImageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                  {errors.mainImageUrl && (
                    <div className="invalid-feedback">
                      {errors.mainImageUrl}
                    </div>
                  )}
                  {form.mainImageUrl && !errors.mainImageUrl && (
                    <img
                      src={form.mainImageUrl}
                      alt="preview"
                      className="ap-img-preview mt-2"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>

                {/* URL hình ảnh phụ */}
                <div className="col-12">
                  <label className="ap-label">
                    URL hình ảnh phụ (Mỗi URL một dòng)
                  </label>
                  <textarea
                    className="form-control ap-input"
                    name="imageUrl"
                    rows={3}
                    value={(form.imageUrl || []).join("\n")}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        imageUrl: e.target.value.split("\n"),
                      }));
                    }}
                    placeholder="https://...&#10;https://..."
                  />
                  {form.imageUrl &&
                    form.imageUrl.some((u) => u.trim() !== "") && (
                      <div className="d-flex gap-2 mt-2 flex-wrap">
                        {form.imageUrl
                          .filter((u) => u.trim() !== "")
                          .map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="preview"
                              className="ap-img-preview"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ))}
                      </div>
                    )}
                </div>

                {/* Mô tả */}
                <div className="col-12">
                  <label className="ap-label">Mô tả *</label>
                  <textarea
                    className={`form-control ap-input ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn..."
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>

                {/* Sizes */}
                <div className="col-12">
                  <label className="ap-label">Kích thước *</label>
                  <div className="ap-checkbox-group">
                    {sizes.map((s) => (
                      <label
                        key={s.id}
                        className={`ap-checkbox-item ${
                          (form.sizeId || []).includes(s.id) ? "checked" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={(form.sizeId || []).includes(s.id)}
                          onChange={(e) => {
                            const currentSizeId = form.sizeId || [];
                            const updated = e.target.checked
                              ? [...currentSizeId, s.id]
                              : currentSizeId.filter((x) => x !== s.id);
                            setForm((f) => ({ ...f, sizeId: updated }));
                            if (updated.length > 0) {
                              setErrors((er) => ({ ...er, sizeId: "" }));
                            }
                          }}
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                  {errors.sizeId && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875em" }}
                    >
                      {errors.sizeId}
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div className="col-12">
                  <label className="ap-label">Màu sắc *</label>
                  <div className="ap-checkbox-group">
                    {colors.map((c) => (
                      <label
                        key={c.id}
                        className={`ap-checkbox-item ${
                          (form.colorId || []).includes(c.id) ? "checked" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={(form.colorId || []).includes(c.id)}
                          onChange={(e) => {
                            const currentColorId = form.colorId || [];
                            const updated = e.target.checked
                              ? [...currentColorId, c.id]
                              : currentColorId.filter((x) => x !== c.id);
                            setForm((f) => ({ ...f, colorId: updated }));
                            if (updated.length > 0) {
                              setErrors((er) => ({ ...er, colorId: "" }));
                            }
                          }}
                        />
                        {c.name}
                      </label>
                    ))}
                  </div>
                  {errors.colorId && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875em" }}
                    >
                      {errors.colorId}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn ap-btn-cancel" onClick={closeModal}>
              Huỷ
            </button>
            {(modalMode === "add" || modalMode === "edit") && (
              <button
                className="btn ap-btn-save"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i
                    className={`bi ${
                      modalMode === "add" ? "bi-plus-lg" : "bi-check-lg"
                    } me-1`}
                  ></i>
                )}
                {modalMode === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
              </button>
            )}
            {modalMode === "delete" && (
              <button
                className="btn ap-btn-delete"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="bi bi-trash me-1"></i>
                )}
                Xác nhận xoá
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
