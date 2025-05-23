import { loginSchema, registerSchema } from "@/schemas/schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { CheckCircleIcon,ArrowRightCircleIcon } from "lucide-react";
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
import { useRegisterMutation } from "./authSlice";
import { Link, useNavigate } from "react-router";

export default function RegisterPage() {
  const [register, { isLoading, isSuccess }] = useRegisterMutation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (e: z.infer<typeof loginSchema>) => {
    try {
      await register(e);
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" container mt-20 flex justify-center">
      <Card className=" m-3  w-[350px] gap-8">
        {!isSuccess ? (
          <>
            <CardHeader className="flex flex-col items-center">
              <CardTitle>Register</CardTitle>
              <CardDescription>Hello, new visitor </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="flex flex-col gap-10"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field}/>
                        </FormControl>
                        <FormDescription>This is the name that will be visble to others</FormDescription>
                        <FormMessage/>
                    </FormItem>}
                  />
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
                  <Button disabled={isLoading} type="submit">
                    Register
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant={"link"}>
                <Link to={"/auth/login"} replace>
                  Already have an account?
                </Link><ArrowRightCircleIcon/>
              </Button>
            </CardFooter>
          </>
        ) : (
          <div className="flex flex-col items-center h-full">
            <div className="flex p-20 gap-10 flex-col items-center">
              <CheckCircleIcon className="bg-green-600 rounded-full" />
              <div>Registerd successfully </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
