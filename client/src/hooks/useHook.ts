import { useEffect, useState } from "react"
// TODO: do this and that2.
export function useHoooks() {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  useEffect(() => {
    setIsMobile(!isMobile)
  })


  return !!isMobile
}
