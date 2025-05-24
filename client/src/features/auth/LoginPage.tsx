import { loginSchema } from "@/schemas/schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ArrowRightCircleIcon, CheckCircleIcon, TriangleAlert } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "./authApi";
import { setUser } from "../users/userSlice";
import { Link, useLocation, useNavigate } from "react-router";
import { useAppDispatch } from "@app/hooks";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [login, { isLoading, isSuccess,isError,error }] = useLoginMutation();



  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/home";
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (e: z.infer<typeof loginSchema>) => {
    try {
      const user = await login(e).unwrap();
      dispatch(setUser(user));
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 3000);
    } catch (error) {
      console.error("Error loging in", error);
    }
  };

  return (
    <div className=" container mt-20 flex justify-center">
      <Card className=" m-3  w-[350px] gap-10">
        {!isSuccess ? (
          <>
            <CardHeader className="flex flex-col items-center">
              <CardTitle>Login</CardTitle>
              <CardDescription>Welcome Back!</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="flex flex-col gap-10"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@gmail.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Please insert your email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input placeholder="********" {...field} />
                        </FormControl>
                        <FormDescription>
                          Please insert the password used on registering
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className={`${isError?"":"hidden"}`}>
                    <TriangleAlert/>
                    {error}
                  </div>
                  <Button disabled={isLoading} type="submit">
                    Login
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant={"link"}>
                <Link to={"/auth/register"} className="flex gap-4" replace>
                  Don't have an account?
                <ArrowRightCircleIcon />
                </Link>
              </Button>
            </CardFooter>
          </>
        ) : (
          <div className="flex flex-col items-center h-full">
            <div className="flex p-20 gap-10 flex-col items-center">
              <CheckCircleIcon className="bg-green-600 rounded-full" />
              <div> Logged in successfully </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
