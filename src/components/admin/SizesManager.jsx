import { useEffect } from "react";
import { useSizeStore } from "../../store/size.store"
import SizeRow from "./SizeRow";
import InputSize from "./InputSize";
import "../../styles/admin/AdminSizeColor.css";

const SizesManager = () => {

  const { sizes, fetchSizes } = useSizeStore();

  useEffect(() => {
    fetchSizes()
  }, [])

  return (
    <div className="size-manager">
      <div className="manager-title-box">
        <div className="manager-icon">📏</div>

        <div>
          <h4>Kích thước (Size)</h4>
          <p>{sizes.length} size đang có</p>
        </div>
      </div>

      <div className="size-list">
        {sizes.map((size) => (
          <SizeRow key={size.id} size={size.name} id={size.id} />
        ))}
      </div>

      <div className="size-form-box">
        <InputSize />
      </div>

      <div className="size-preview">
        <p>Preview trên trang sản phẩm</p>


        <div className="product-preview-group">
          <h5>Kích thước</h5>

          <div className="product-option-list">
            {sizes.map((size, index) => (
              <button
                key={size.id}
                type="button"
                className={`product-option-btn ${index === 1 ? "active" : ""}`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default SizesManager
