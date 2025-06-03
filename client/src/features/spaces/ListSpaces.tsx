import { useGetSpacesQuery } from "./spacesSlice"

export default function ListSpaces() {
  const { data: spaces = [], isLoading, isError } = useGetSpacesQuery()

  return (
    <div>

      <ul>
        {spaces.map((space) => (
          <li key={space.id}>
            {space.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

