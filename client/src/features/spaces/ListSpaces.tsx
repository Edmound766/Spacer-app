import SpaceCard from "./SpaceCard"
import { useGetSpacesQuery } from "./spacesSlice"

export default function ListSpaces() {
  const { data: spaces = [], isLoading, isError } = useGetSpacesQuery()

  if (isLoading) {
    return <div>Is loading ....</div>

  }
  if (isError) {
    return <div>Occured</div>
  }
  return (
    <div>
      <div className=" flex flex-wrap gap-4">
        {spaces.map(space => (
          <li>
            <SpaceCard props={space} />
          </li>
        ))}
      </div>
    </div>
  )
}

