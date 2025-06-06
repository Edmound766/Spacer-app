import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router";
import { ArrowLeft, TriangleAlert } from "lucide-react";

export default function Error404() {
  const location = useLocation();
  console.log(location);
  let from = location.state?.from?.pathname || "/";

  if (location.pathname.split("/").includes("admin")) from = "/admin";
  return (
    <div className=" container flex flex-col w-full h-dvh items-center  justify-center">
      <Card className=" m-3 w-[750px] h-1/2 gap-10">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-orange-400">Error 404 </CardTitle>
          <CardDescription>Oops wrong page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p>Page not found </p>
          <div>
            <TriangleAlert className="size-32 text-red-700 " />
          </div>

          <Button variant={"link"} className="  underline">
            <Link to={from} className="flex" replace>
              <ArrowLeft /><p>Return</p>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
