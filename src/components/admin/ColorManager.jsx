import { useEffect } from "react"
import { useColorStore } from "../../store/color.store"
import InputColor from "./InputColor"
import ColorRow from "./ColorRow"
import "../../styles/admin/AdminSizeColor.css";

const ColorManager = () => {
  const { colors, fetchColors } = useColorStore()

  useEffect(() => {
    fetchColors()
  }, [])

  return (
    <div className="color-manager">
      <div className="manager-title-box">
        <div className="manager-icon color-icon">🎨</div>

        <div>
          <h4>Màu sắc</h4>
          <p>{colors.length} màu đang có</p>
        </div>
      </div>

      <div className="color-list">
        {colors.map((color) => (
          <ColorRow key={color.id} color={color.name} id={color.id} />
        ))}
      </div>

      <div className="color-form-box">
        <InputColor />
      </div>

      <div className="color-preview">
        <p>Preview trên trang sản phẩm</p>

        <div className="product-preview-group">
          <h5>Màu sắc</h5>

          <div className="product-option-list">
            {colors.map((color, index) => (
              <button
                key={color.id}
                type="button"
                className={`product-option-btn ${index === 0 ? "active" : ""}`}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorManager
