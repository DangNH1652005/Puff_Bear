import { useEffect } from "react";
import { useSizeStore } from "../../store/size.store"
import SizeRow from "./SizeRow";
import InputSize from "./InputSize";

const SizesManager = () => {

  const { sizes, fetchSizes } = useSizeStore();

  useEffect(() => {
    fetchSizes()
  }, [])

  return (
    <div>
      <div>
        {sizes.map((size) => (
          <SizeRow key={size.id} size={size.name} id={size.id} />
        ))}
      </div>
      <div>
        <InputSize />
      </div>
    </div>
  )
}

export default SizesManager
