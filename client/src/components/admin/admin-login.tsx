import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lock, Shield, Home, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/components/admin/admin-auth-provider";
import { Link } from "wouter";

const loginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { toast } = useToast();
  const { login } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const success = await login(data.password);

      if (success) {
        toast({
          title: "로그인 성공",
          description: "관리자 페이지에 접속했습니다.",
        });
        onLoginSuccess();
      } else {
        toast({
          title: "로그인 실패",
          description: "비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Top Navigation */}
      <div className="relative z-10 p-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-blue-600 hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
            data-testid="button-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            홈페이지로 돌아가기
          </Button>
        </Link>
      </div>

      {/* Login Form Container */}
      <div className="flex items-center justify-center px-4 pt-16 pb-20">
        <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full w-fit">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            관리자 로그인
          </CardTitle>
          <p className="text-gray-600 text-lg">
            관리자 페이지에 접근하려면 비밀번호를 입력해주세요
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">비밀번호</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="비밀번호를 입력하세요"
                          className="pl-12 h-12 text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                          data-testid="input-admin-password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isLoading}
                data-testid="button-admin-login"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </Form>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}