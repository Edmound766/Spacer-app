import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type Space } from "./spacesSlice.ts"

export default function SpaceCard({ props: { name, availability, id, owner_name } }: { props: Space }
) {
  const IssAvailbale = () => {
    if (availability) {
      return <div>The space is available</div>
    }
    return <div>not available</div>
  }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {name},{availability},{id},{owner_name}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <IsAvailbale></IsAvailbale>
        </CardFooter>
      </Card>
    </div>
  )
}
