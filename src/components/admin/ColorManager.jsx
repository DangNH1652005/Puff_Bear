import { useEffect } from "react"
import { useColorStore } from "../../store/color.store"
import InputColor from "./InputColor"
import ColorRow from "./ColorRow"

const ColorManager = () => {
  const { colors, fetchColors } = useColorStore()

  console.log(colors);

  useEffect(() => {
    fetchColors()
  }, [])

  return (
    <div>
      <div>
        {colors.map((color) => (
          <ColorRow key={color.id} color={color.name} id={color.id} />
        ))}
      </div>
      <div>
        <InputColor />
      </div>
    </div>
  )
}

export default ColorManager
