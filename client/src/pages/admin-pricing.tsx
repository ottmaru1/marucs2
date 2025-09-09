import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, DollarSign, Monitor, Tv, Shield, Settings, ArrowLeft, Home, Upload, FileText, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ServicePackage, StreamplayerOption } from "@shared/schema";
import { useAdminAuth } from "@/components/admin/admin-auth-provider";

const servicePackageSchema = z.object({
  serviceId: z.string().min(1, "서비스 ID를 입력해주세요"),
  name: z.string().min(1, "서비스 이름을 입력해주세요"),
  description: z.string().optional(),
  basePrice: z.number().min(0, "가격은 0 이상이어야 합니다"),
  priceUnit: z.string().min(1, "가격 단위를 입력해주세요"),
  priceType: z.string().min(1, "가격 타입을 선택해주세요"),
  sortOrder: z.number().optional(),
});

const streamplayerOptionSchema = z.object({
  name: z.string().min(1, "옵션 이름을 입력해주세요"),
  services: z.array(z.string()).min(1, "최소 하나의 서비스를 선택해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  sortOrder: z.number().optional(),
});

type ServicePackageForm = z.infer<typeof servicePackageSchema>;
type StreamplayerOptionForm = z.infer<typeof streamplayerOptionSchema>;

export default function AdminPricing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logout } = useAdminAuth();
  const [location] = useLocation();
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [editingOption, setEditingOption] = useState<StreamplayerOption | null>(null);

  const packageForm = useForm<ServicePackageForm>({
    resolver: zodResolver(servicePackageSchema),
    defaultValues: {
      serviceId: "ott-plus",
      name: "",
      description: "",
      basePrice: 0,
      priceUnit: "room",
      priceType: "fixed",
      sortOrder: 0,
    },
  });

  const optionForm = useForm<StreamplayerOptionForm>({
    resolver: zodResolver(streamplayerOptionSchema),
    defaultValues: {
      name: "",
      services: [],
      price: 0,
      sortOrder: 0,
    },
  });

  const { data: servicePackages = [], isLoading: isLoadingPackages } = useQuery<ServicePackage[]>({
    queryKey: ["/api/service-packages"],
  });

  const { data: streamplayerOptions = [], isLoading: isLoadingOptions } = useQuery<StreamplayerOption[]>({
    queryKey: ["/api/streamplayer-options"],
  });

  const createPackageMutation = useMutation({
    mutationFn: async (data: ServicePackageForm) => {
      const response = await apiRequest("/api/service-packages", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "성공", description: "서비스 패키지가 생성되었습니다." });
      setIsPackageDialogOpen(false);
      packageForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/service-packages"] });
    },
    onError: () => {
      toast({ title: "오류", description: "서비스 패키지 생성에 실패했습니다.", variant: "destructive" });
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServicePackageForm> }) => {
      const response = await apiRequest(`/api/service-packages/${id}`, "PUT", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "성공", description: "서비스 패키지가 수정되었습니다." });
      setIsPackageDialogOpen(false);
      setEditingPackage(null);
      packageForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/service-packages"] });
    },
    onError: () => {
      toast({ title: "오류", description: "서비스 패키지 수정에 실패했습니다.", variant: "destructive" });
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/service-packages/${id}`, "DELETE");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "성공", description: "서비스 패키지가 삭제되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["/api/service-packages"] });
    },
    onError: () => {
      toast({ title: "오류", description: "서비스 패키지 삭제에 실패했습니다.", variant: "destructive" });
    },
  });

  const createOptionMutation = useMutation({
    mutationFn: async (data: StreamplayerOptionForm) => {
      const response = await apiRequest("/api/streamplayer-options", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "성공", description: "스트림플레이어 옵션이 생성되었습니다." });
      setIsOptionDialogOpen(false);
      optionForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/streamplayer-options"] });
    },
    onError: () => {
      toast({ title: "오류", description: "스트림플레이어 옵션 생성에 실패했습니다.", variant: "destructive" });
    },
  });

  const updateOptionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StreamplayerOptionForm> }) => {
      const response = await apiRequest(`/api/streamplayer-options/${id}`, "PUT", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "성공", description: "스트림플레이어 옵션이 수정되었습니다." });
      setIsOptionDialogOpen(false);
      setEditingOption(null);
      optionForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/streamplayer-options"] });
    },
    onError: () => {
      toast({ title: "오류", description: "스트림플레이어 옵션 수정에 실패했습니다.", variant: "destructive" });
    },
  });

  const deleteOptionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/streamplayer-options/${id}`, "DELETE");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "성공", description: "스트림플레이어 옵션이 삭제되었습니다." });
      queryClient.invalidateQueries({ queryKey: ["/api/streamplayer-options"] });
    },
    onError: () => {
      toast({ title: "오류", description: "스트림플레이어 옵션 삭제에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleEditPackage = (pkg: ServicePackage) => {
    setEditingPackage(pkg);
    packageForm.reset({
      serviceId: pkg.serviceId,
      name: pkg.name,
      description: pkg.description || "",
      basePrice: pkg.basePrice,
      priceUnit: pkg.priceUnit,
      priceType: pkg.priceType,
      sortOrder: pkg.sortOrder,
    });
    setIsPackageDialogOpen(true);
  };

  const handleEditOption = (option: StreamplayerOption) => {
    setEditingOption(option);
    optionForm.reset({
      name: option.name,
      services: option.services,
      price: option.price,
      sortOrder: option.sortOrder,
    });
    setIsOptionDialogOpen(true);
  };

  const onPackageSubmit = (data: ServicePackageForm) => {
    if (editingPackage) {
      updatePackageMutation.mutate({ id: editingPackage.id, data });
    } else {
      createPackageMutation.mutate(data);
    }
  };

  const onOptionSubmit = (data: StreamplayerOptionForm) => {
    if (editingOption) {
      updateOptionMutation.mutate({ id: editingOption.id, data });
    } else {
      createOptionMutation.mutate(data);
    }
  };

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'ott-plus': return Tv;
      case 'streamplayer': return Monitor;
      case 'netflix-account': return Shield;
      case 'nohard-system': return Settings;
      default: return DollarSign;
    }
  };

  const menuItems = [
    {
      id: "upload",
      label: "파일 업로드",
      description: "새 파일 업로드",
      icon: Upload,
      href: "/admin"
    },
    {
      id: "manage",
      label: "파일 관리", 
      description: "업로드된 파일 관리",
      icon: FileText,
      href: "/admin"
    },
    {
      id: "pricing",
      label: "가격 관리",
      description: "서비스 가격 설정",
      icon: DollarSign,
    },
    {
      id: "home",
      label: "홈페이지",
      description: "메인 사이트로 이동",
      icon: Home,
      href: "/"
    },
  ];

  const handleMenuClick = (item: any) => {
    if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Always visible */}
      <div className="w-64 bg-white shadow-xl flex-shrink-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
            <h2 className="text-lg font-bold">관리자페이지</h2>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === "pricing";
              
              return (
                <div key={item.id} className="space-y-1">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start px-3 py-2 text-sm ${
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => handleMenuClick(item)}
                    data-testid={`button-menu-${item.id}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-xs">{item.label}</span>
                      <span className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {item.description}
                      </span>
                    </div>
                  </Button>
                </div>
              );
            })}
          </div>
          
          {/* Logout section */}
          <div className="p-3 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm"
              data-testid="button-logout-sidebar"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="font-medium text-xs">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">가격 관리</h1>
              <p className="text-gray-600 text-lg">서비스 패키지와 스트림플레이어 옵션의 가격을 설정하세요</p>
            </div>

        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="packages">서비스 패키지</TabsTrigger>
            <TabsTrigger value="options">스트림플레이어 옵션</TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">서비스 패키지 관리</h2>
              <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingPackage(null);
                      packageForm.reset({
                        serviceId: "ott-plus",
                        name: "",
                        description: "",
                        basePrice: 0,
                        priceUnit: "room",
                        priceType: "fixed",
                        sortOrder: 0,
                      });
                    }}
                    data-testid="button-add-package"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    패키지 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPackage ? "패키지 수정" : "새 패키지 추가"}
                    </DialogTitle>
                    <DialogDescription>
                      서비스 패키지의 정보와 가격을 설정하세요
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...packageForm}>
                    <form onSubmit={packageForm.handleSubmit(onPackageSubmit)} className="space-y-4">
                      <FormField
                        control={packageForm.control}
                        name="serviceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>서비스 ID</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="서비스를 선택하세요" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ott-plus">OTT PLUS</SelectItem>
                                <SelectItem value="streamplayer">StreamPlayer</SelectItem>
                                <SelectItem value="netflix-account">Netflix 계정</SelectItem>
                                <SelectItem value="nohard-system">NoHard 시스템</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packageForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>서비스 이름</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packageForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>설명</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packageForm.control}
                        name="basePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>기본 가격 (VAT포함)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packageForm.control}
                        name="priceUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>가격 단위</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="room">객실</SelectItem>
                                <SelectItem value="pc">PC</SelectItem>
                                <SelectItem value="account">계정</SelectItem>
                                <SelectItem value="monthly">월</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packageForm.control}
                        name="priceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>가격 타입</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fixed">고정가격</SelectItem>
                                <SelectItem value="variable">변동가격</SelectItem>
                                <SelectItem value="tiered">단계별가격</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPackageDialogOpen(false)}
                          data-testid="button-cancel"
                        >
                          취소
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          data-testid="button-submit"
                        >
                          {createPackageMutation.isPending || updatePackageMutation.isPending ? "처리 중..." : (editingPackage ? "수정" : "생성")}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingPackages ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  로딩 중...
                </div>
              ) : servicePackages.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  등록된 서비스 패키지가 없습니다
                </div>
              ) : (
                servicePackages.map((pkg: ServicePackage) => {
                  const IconComponent = getServiceIcon(pkg.serviceId);
                  return (
                    <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900">{pkg.name}</CardTitle>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {pkg.serviceId}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditPackage(pkg)}
                              data-testid={`button-edit-package-${pkg.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deletePackageMutation.mutate(pkg.id)}
                              data-testid={`button-delete-package-${pkg.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {pkg.description && (
                          <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                        )}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">기본 가격</span>
                            <span className="font-semibold text-gray-900">
                              {pkg.basePrice.toLocaleString()}원/{pkg.priceUnit}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">가격 타입</span>
                            <Badge variant="outline">
                              {pkg.priceType === 'fixed' ? '고정' : 
                               pkg.priceType === 'variable' ? '변동' : '단계별'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="options" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">스트림플레이어 옵션 관리</h2>
              <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingOption(null);
                      optionForm.reset({
                        name: "",
                        services: [],
                        price: 0,
                        sortOrder: 0,
                      });
                    }}
                    data-testid="button-add-option"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    옵션 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingOption ? "옵션 수정" : "새 옵션 추가"}
                    </DialogTitle>
                    <DialogDescription>
                      스트림플레이어 서비스 조합과 가격을 설정하세요
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...optionForm}>
                    <form onSubmit={optionForm.handleSubmit(onOptionSubmit)} className="space-y-4">
                      <FormField
                        control={optionForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>옵션 이름</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="예: 넷플릭스 + 디즈니+" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={optionForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PC 전용 스트리밍 프로그램</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsOptionDialogOpen(false)}
                          data-testid="button-cancel-option"
                        >
                          취소
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createOptionMutation.isPending || updateOptionMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          data-testid="button-submit-option"
                        >
                          {createOptionMutation.isPending || updateOptionMutation.isPending ? "처리 중..." : (editingOption ? "수정" : "생성")}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingOptions ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  로딩 중...
                </div>
              ) : streamplayerOptions.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  등록된 스트림플레이어 옵션이 없습니다
                </div>
              ) : (
                streamplayerOptions.map((option: StreamplayerOption) => (
                  <Card key={option.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <Monitor className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-lg text-gray-900">{option.name}</CardTitle>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditOption(option)}
                            data-testid={`button-edit-option-${option.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteOptionMutation.mutate(option.id)}
                            data-testid={`button-delete-option-${option.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500 block mb-1">포함 서비스</span>
                          <div className="flex flex-wrap gap-1">
                            {option.services.map((service) => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">가격</span>
                          <span className="font-semibold text-lg text-purple-600">
                            {option.price.toLocaleString()}원/월
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}