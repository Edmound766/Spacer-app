import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";

export default function Error404() {
    
    const location = useLocation()
    console.log(location);
    
     const from = location.state?.from?.pathname || "/";
    return (
        <div className="flex flex-col justify-around">
            <h1>Error 404</h1>
            <p>Page not found </p>
            <Button variant={"secondary"}>

            <Link to={from} replace> Return</Link>
            </Button>
        </div>
    )
}
