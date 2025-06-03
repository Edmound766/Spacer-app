import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import { NavLink, useLocation } from "react-router";

export default function Error404() {

  const location = useLocation()
  console.log(location);

  const from = location.state?.from?.pathname || "/home";
  return (
    <div className="flex h-full justify-center pt-10">
      <Card className="w-2/4 h-2/4">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">

            <TriangleAlert size={80} color="red" />
            <h1 className="text-red-500">Error 404</h1>
          </div>
        </CardContent>

        <CardFooter>

          <Button className="align-middle">
            <NavLink to={from}>
              Return</NavLink>
          </Button>

        </CardFooter>
      </Card>
    </div>
  )
}
