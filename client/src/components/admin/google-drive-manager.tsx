import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cloud, Plus, Trash2, Settings, Shield, CheckCircle, XCircle, Key, RefreshCw, RotateCcw, AlertTriangle, Star, Power, PowerOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Google Drive Account interface
interface GoogleDriveAccount {
  id: string;
  accountName: string;
  email: string;
  isActive: boolean;
  isDefault: boolean;
  profilePicture?: string;
  createdAt: string;
  tokenExpired: boolean;
}

// Add account form schema
const addAccountSchema = z.object({
  accountName: z.string().min(1, "계정 이름을 입력해주세요")
});

type AddAccountForm = z.infer<typeof addAccountSchema>;

export default function GoogleDriveManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAccountChange, setPendingAccountChange] = useState<{id: string, email: string} | null>(null);
  const [syncWarning, setSyncWarning] = useState<any>(null);
  
  // State for account management
  const [pendingAction, setPendingAction] = useState<{ type: 'activate' | 'deactivate' | 'delete', accountId: string, accountName: string } | null>(null);

  // Form setup
  const addForm = useForm<AddAccountForm>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      accountName: ""
    }
  });

  // OAuth 완료 메시지 리스너 - 팝업에서 메인 창으로 완료 신호 받기
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'google-oauth-complete') {
        // OAuth 완료 시 계정 목록 새로고침
        queryClient.invalidateQueries({ queryKey: ["/api/auth/google/accounts"] });
        
        const action = event.data.action;
        const email = event.data.email;
        
        toast({
          title: action === 'added' ? "✅ 계정 추가 완료" : "✅ 계정 업데이트 완료",
          description: action === 'added' 
            ? `${email} 계정이 성공적으로 추가되었습니다` 
            : `${email} 계정 토큰이 성공적으로 갱신되었습니다`,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [queryClient, toast]);

  // Fetch accounts
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["/api/auth/google/accounts"],
    queryFn: async () => {
      const result = await apiRequest("/api/auth/google/accounts");
      // 디버깅: 실제 받은 데이터 로그
      console.log("🔍 Frontend received accounts data:", result);
      if (result && result.length > 0) {
        result.forEach((account: any, index: number) => {
          console.log(`Account ${index + 1}:`, {
            email: account.email,
            tokenExpired: account.tokenExpired,
            typeof_tokenExpired: typeof account.tokenExpired
          });
        });
      }
      return result;
    },
    staleTime: 0, // 캐시를 즉시 stale로 설정
    gcTime: 0, // 가비지 컬렉션 즉시 실행
  });

  // Add account mutation
  const addAccountMutation = useMutation({
    mutationFn: async (data: AddAccountForm) => {
      const response = await apiRequest("/api/auth/google/authorize", {
        method: "POST",
        body: data,
      });
      return response;
    },
    onSuccess: (data) => {
      window.open(data.authUrl, '_blank', 'width=600,height=600');
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({
        title: "인증 창이 열렸습니다",
        description: "새 창에서 구글 계정으로 로그인해주세요",
      });
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/google/accounts"] });
      }, 3000);
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message || "계정 추가에 실패했습니다",
        variant: "destructive",
      });
    },
  });

  // Auth account mutation
  const authAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const response = await apiRequest(`/api/auth/google/accounts/${accountId}/reauth`, {
        method: "POST",
      });
      return response;
    },
    onSuccess: (data) => {
      const popup = window.open(data.authUrl, '_blank', 'width=600,height=600');
      
      if (!popup || popup.closed || typeof popup.closed == 'undefined') {
        // 팝업이 차단된 경우
        toast({
          title: "팝업이 차단되었습니다",
          description: "브라우저 설정에서 팝업을 허용하거나 아래 링크를 클릭하세요",
          variant: "destructive",
        });
        
        // 직접 링크로 이동할 수 있는 옵션 제공
        const linkElement = document.createElement('a');
        linkElement.href = data.authUrl;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.click();
      } else {
        toast({
          title: "재인증 창이 열렸습니다",
          description: "새 창에서 구글 계정으로 다시 로그인해주세요",
        });
      }
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/google/accounts"] });
      }, 3000);
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message || "계정 재인증에 실패했습니다",
        variant: "destructive",
      });
    },
  });

  // Set default account mutation
  const setDefaultMutation = useMutation({
    mutationFn: async ({ accountId, force = false }: { accountId: string, force?: boolean }) => {
      const url = `/api/auth/google/accounts/${accountId}/set-default${force ? '?force=true' : ''}`;
      return await apiRequest(url, {
        method: "PUT",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "기본 계정 설정 완료",
        description: data.forced ? 
          `강제로 기본 계정이 ${data.newDefault}로 변경되었습니다.` :
          `기본 계정이 ${data.newDefault}로 변경되었습니다.`,
      });
      setShowConfirmDialog(false);
      setPendingAccountChange(null);
      setSyncWarning(null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/google/accounts"] });
    },
    onError: (error: any) => {
      if (error.status === 409 && error.needsSync) {
        // 동기화 필요한 경우
        setSyncWarning(error);
        setShowConfirmDialog(true);
      } else {
        toast({
          title: "기본 계정 설정 실패",
          description: error.message || "기본 계정 설정에 실패했습니다.",
          variant: "destructive",
        });
      }
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      return await apiRequest(`/api/auth/google/accounts/${accountId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/google/accounts"] });
      toast({
        title: "성공",
        description: "계정이 완전히 삭제되었습니다",
      });
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message || "계정 삭제에 실패했습니다",
        variant: "destructive",
      });
    },
  });



  // Synchronize files from default account to others
  const synchronizeFilesMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/google-drive/synchronize", {
        method: "POST"
      });
    },
    onSuccess: (data) => {
      toast({
        title: "파일 동기화 완료",
        description: `기본 계정 ${data.defaultAccount}에서 ${data.totalSyncedFiles || 0}개 파일이 ${data.targetAccountCount || 0}개 계정에 동기화되었습니다.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/downloads"] });
    },
    onError: (error: any) => {
      toast({
        title: "파일 동기화 실패",
        description: error.message || "파일 동기화 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  });

  // Token refresh mutation
  const refreshTokensMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/google-drive/refresh-tokens", {
        method: "POST"
      });
    },
    onSuccess: (data) => {
      const refreshedCount = data.results?.filter((r: any) => r.status === 'refreshed').length || 0;
      const failedCount = data.results?.filter((r: any) => r.status === 'failed' || r.status === 'error').length || 0;
      
      toast({
        title: "토큰 갱신 완료",
        description: `${refreshedCount}개 계정 토큰 갱신 완료${failedCount > 0 ? `, ${failedCount}개 계정 실패` : ''}`,
        variant: failedCount > 0 ? "destructive" : "default"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/google/accounts"] });
    },
    onError: (error: any) => {
      toast({
        title: "토큰 갱신 실패",
        description: error.message || "토큰 갱신 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  });

  const handleAddAccount = (data: AddAccountForm) => {
    addAccountMutation.mutate(data);
  };

  const handleAuthAccount = (accountId: string) => {
    authAccountMutation.mutate(accountId);
  };

  const handleSetDefault = (accountId: string, email: string) => {
    setPendingAccountChange({ id: accountId, email });
    setDefaultMutation.mutate({ accountId });
  };

  const handleForceChange = () => {
    if (pendingAccountChange) {
      setDefaultMutation.mutate({ accountId: pendingAccountChange.id, force: true });
    }
  };

  const handleSyncFirst = () => {
    setShowConfirmDialog(false);
    synchronizeFilesMutation.mutate();
  };

  // Account activation/deactivation mutations
  const toggleAccountMutation = useMutation({
    mutationFn: async ({ accountId, activate }: { accountId: string, activate: boolean }) => {
      return await apiRequest(`/api/auth/google/accounts/${accountId}/${activate ? 'activate' : 'deactivate'}`, {
        method: "PUT",
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/google/accounts"] });
      toast({
        title: "계정 상태 변경 완료",
        description: variables.activate ? "계정이 활성화되었습니다" : "계정이 비활성화되었습니다",
      });
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message || "계정 상태 변경에 실패했습니다",
        variant: "destructive",
      });
    },
  });

  const handleToggleAccount = (accountId: string, activate: boolean) => {
    toggleAccountMutation.mutate({ accountId, activate });
  };

  const handleDeleteAccount = (accountId: string, accountName: string) => {
    const account = accounts?.find((acc: GoogleDriveAccount) => acc.id === accountId);
    if (account?.isDefault) {
      toast({
        title: "오류",
        description: "기본 계정은 삭제할 수 없습니다",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`계정 "${accountName}"을 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      deleteAccountMutation.mutate(accountId);
    }
  };

  const renderAccountStatus = (account: GoogleDriveAccount) => {
    if (!account.isActive) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-300">
            <XCircle className="w-3 h-3 mr-1" />
            비활성
          </Badge>
        </div>
      );
    }
    if (account.tokenExpired) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            토큰 만료
          </Badge>
        </div>
      );
    }
    if (account.isDefault) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-300">
            <Shield className="w-3 h-3 mr-1" />
            기본 계정
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          활성
        </Badge>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            구글 드라이브 계정 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-600">로딩 중...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          구글 드라이브 계정 관리
        </h3>
        <div className="flex flex-col lg:flex-row gap-2">
          <Button 
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/auth/google/accounts"] });
              toast({
                title: "계정 상태 새로고침",
                description: "계정 목록을 다시 불러왔습니다",
              });
            }}
            className="bg-green-600 hover:bg-green-700 text-white flex-1 lg:flex-none"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            계정 새로고침
          </Button>
          <Button 
            onClick={() => refreshTokensMutation.mutate()}
            disabled={refreshTokensMutation.isPending || !accounts?.length}
            className="bg-orange-600 hover:bg-orange-700 text-white flex-1 lg:flex-none"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {refreshTokensMutation.isPending ? "갱신 중..." : "토큰 갱신"}
          </Button>
          <Button 
            onClick={() => synchronizeFilesMutation.mutate()}
            disabled={synchronizeFilesMutation.isPending || !accounts?.length}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 lg:flex-none"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {synchronizeFilesMutation.isPending ? "동기화 중..." : "파일 동기화"}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 lg:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                계정 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-900">구글 드라이브 계정 추가</DialogTitle>
                <DialogDescription className="text-gray-600">
                  새로운 구글 계정을 연결하여 파일 스토리지로 사용하세요.
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(handleAddAccount)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">계정 이름</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="예: 관리자 계정, 백업 계정"
                            className="border-gray-300 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="border-gray-300 text-gray-700"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      disabled={addAccountMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {addAccountMutation.isPending ? "추가 중..." : "계정 추가"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Accounts Table */}
      {accounts && accounts.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-sm min-w-0">
          <CardHeader>
            <CardTitle className="text-gray-900 text-sm">연결된 계정</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {accounts.map((account: GoogleDriveAccount) => (
                <Card key={account.id} className="bg-gray-50 border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{account.accountName}</h4>
                          <p className="text-sm text-gray-600 truncate">{account.email || "인증 필요"}</p>
                          <div className="mt-2">
                            {renderAccountStatus(account)}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          {!account.isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAuthAccount(account.id)}
                              disabled={authAccountMutation.isPending}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50 px-2 py-1 h-7"
                              title="계정 인증"
                            >
                              <Key className="w-3 h-3" />
                            </Button>
                          )}
                          {account.tokenExpired && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAuthAccount(account.id)}
                              disabled={authAccountMutation.isPending}
                              className="text-orange-600 border-orange-300 hover:bg-orange-50 px-2 py-1 h-7"
                              title="토큰 갱신"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          )}
                          
                          {/* 드롭다운 메뉴 */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-600 border-gray-300 hover:bg-gray-50 px-2 py-1 h-7"
                                title="계정 관리"
                              >
                                <Settings className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* Mobile dropdown content will be same as desktop */}
                              {account.tokenExpired && (
                                <DropdownMenuItem
                                  onClick={() => handleAuthAccount(account.id)}
                                  disabled={authAccountMutation.isPending}
                                  className="text-orange-600 hover:bg-orange-50"
                                >
                                  <Key className="w-4 h-4 mr-2" />
                                  토큰 재인증
                                </DropdownMenuItem>
                              )}
                              
                              {account.isActive ? (
                                <DropdownMenuItem
                                  onClick={() => setPendingAction({ type: 'deactivate', accountId: account.id, accountName: account.accountName })}
                                  className="text-orange-600 hover:bg-orange-50"
                                >
                                  <PowerOff className="w-4 h-4 mr-2" />
                                  비활성화
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => setPendingAction({ type: 'activate', accountId: account.id, accountName: account.accountName })}
                                  className="text-green-600 hover:bg-green-50"
                                >
                                  <Power className="w-4 h-4 mr-2" />
                                  활성화
                                </DropdownMenuItem>
                              )}
                              
                              {!account.isDefault && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setPendingAction({ type: 'delete', accountId: account.id, accountName: account.accountName })}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    계정 삭제
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">계정명</TableHead>
                    <TableHead className="text-gray-700">이메일</TableHead>
                    <TableHead className="text-gray-700">상태</TableHead>
                    <TableHead className="text-gray-700 text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account: GoogleDriveAccount) => (
                    <TableRow key={account.id}>
                      <TableCell className="text-gray-900 font-medium">
                        {account.accountName}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {account.email || "인증 필요"}
                      </TableCell>
                      <TableCell>
                        {renderAccountStatus(account)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {!account.isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAuthAccount(account.id)}
                              disabled={authAccountMutation.isPending}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50 px-2 py-1 h-7"
                              title="계정 인증"
                            >
                              <Key className="w-3 h-3" />
                            </Button>
                          )}
                          {account.tokenExpired && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAuthAccount(account.id)}
                              disabled={authAccountMutation.isPending}
                              className="text-orange-600 border-orange-300 hover:bg-orange-50 px-2 py-1 h-7"
                              title="토큰 갱신"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          )}
                          
                          {/* 드롭다운 메뉴 */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-600 border-gray-300 hover:bg-gray-50 px-2 py-1 h-7"
                                title="계정 관리"
                              >
                                <Settings className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            {/* 토큰 재인증 메뉴 */}
                            {(account.tokenExpired || !account.isActive) && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleAuthAccount(account.id)}
                                  disabled={authAccountMutation.isPending}
                                  className="text-blue-600"
                                >
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  {account.tokenExpired ? "토큰 갱신" : "계정 재인증"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            
                            {account.isActive && !account.isDefault && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleSetDefault(account.id, account.email)}
                                  disabled={setDefaultMutation.isPending}
                                  className="text-green-600"
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  기본 계정으로 설정
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            
                            {account.isActive ? (
                              <DropdownMenuItem
                                onClick={() => handleToggleAccount(account.id, false)}
                                disabled={toggleAccountMutation.isPending || account.isDefault}
                                className="text-orange-600"
                              >
                                <PowerOff className="w-4 h-4 mr-2" />
                                계정 비활성화
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleToggleAccount(account.id, true)}
                                disabled={toggleAccountMutation.isPending}
                                className="text-green-600"
                              >
                                <Power className="w-4 h-4 mr-2" />
                                계정 활성화
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteAccount(account.id, account.accountName)}
                              disabled={deleteAccountMutation.isPending || account.isDefault}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              계정 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Guide */}
      <Card className="bg-blue-50 border border-blue-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4" />
            구글 클라우드 콘솔 설정 가이드
          </CardTitle>
          <div className="space-y-4 text-sm">
            <div className="space-y-3">
              <div className="border-l-4 border-blue-400 pl-3 bg-blue-100">
                <p className="font-semibold text-blue-800 mb-1">1. Google Cloud Console 접속</p>
                <p>• <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Google Cloud Console</a>에 접속하여 프로젝트 생성</p>
              </div>

              <div className="border-l-4 border-green-400 pl-3 bg-green-50">
                <p className="font-semibold text-green-800 mb-1">2. Google Drive API 활성화</p>
                <p>• API 및 서비스 → 라이브러리 → "Google Drive API" 검색 후 사용 설정</p>
              </div>

              <div className="border-l-4 border-yellow-400 pl-3 bg-yellow-50">
                <p className="font-semibold text-yellow-800 mb-1">3. OAuth 동의 화면 구성</p>
                <p>• API 및 서비스 → OAuth 동의 화면 → 외부 선택 → 앱 정보 입력</p>
              </div>

              <div className="border-l-4 border-purple-400 pl-3 bg-purple-50">
                <p className="font-semibold text-purple-800 mb-1">4. OAuth 클라이언트 ID 생성</p>
                <p>• API 및 서비스 → 사용자 인증 정보 → 사용자 인증 정보 만들기 → OAuth 클라이언트 ID</p>
                <p>• 애플리케이션 유형: 웹 애플리케이션</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="font-medium text-purple-700">승인된 자바스크립트 원본:</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-purple-100 px-2 py-1 rounded text-xs text-purple-800 flex-1">
                        https://258c0df6-4caa-4bc6-ad62-93cc7a44effb-00-2dmqihs3x26jc.spock.replit.dev
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText('https://258c0df6-4caa-4bc6-ad62-93cc7a44effb-00-2dmqihs3x26jc.spock.replit.dev');
                          toast({ title: "복사됨", description: "원본 URL이 클립보드에 복사되었습니다" });
                        }}
                        className="px-2 py-1 h-6 text-xs"
                      >
                        복사
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-purple-700">승인된 리디렉션 URI:</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-purple-100 px-2 py-1 rounded text-xs text-purple-800 flex-1">
                        https://258c0df6-4caa-4bc6-ad62-93cc7a44effb-00-2dmqihs3x26jc.spock.replit.dev/api/auth/google/callback
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText('https://258c0df6-4caa-4bc6-ad62-93cc7a44effb-00-2dmqihs3x26jc.spock.replit.dev/api/auth/google/callback');
                          toast({ title: "복사됨", description: "리디렉션 URI가 클립보드에 복사되었습니다" });
                        }}
                        className="px-2 py-1 h-6 text-xs"
                      >
                        복사
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-red-700 mt-2">• 복사 버튼을 클릭하여 각 URL을 Google Cloud Console의 해당 필드에 붙여넣기</p>
              </div>

              <div className="border-l-4 border-green-400 pl-3 bg-green-50">
                <p className="font-semibold text-green-800 mb-1">5. 환경 변수 설정</p>
                <p>• 생성된 클라이언트 ID와 클라이언트 보안 비밀을 Replit Secrets에 등록</p>
                <p>• GOOGLE_CLIENT_ID: 클라이언트 ID</p>
                <p>• GOOGLE_CLIENT_SECRET: 클라이언트 보안 비밀</p>
              </div>

              <div className="mt-3 p-3 bg-blue-100 rounded">
                <p className="text-sm text-blue-800 font-semibold mb-1">💡 중요 안내:</p>
                <p className="text-xs text-blue-700">
                  • 환경변수는 <strong>한 번만</strong> 설정하면 됩니다<br/>
                  • 추가 Google 계정은 같은 OAuth 클라이언트를 사용해서 '계정 추가' 버튼으로 연결<br/>
                  • 계정별로 새로운 환경변수를 만들 필요 없음
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Confirmation Dialog for Account Change */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <AlertDialogTitle>기본 계정 변경 확인</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-3">
              {syncWarning && (
                <>
                  <p className="text-gray-700">
                    {syncWarning.message}
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <strong>권장:</strong> 먼저 파일 동기화를 실행하여 모든 계정에 파일을 복사한 후 기본 계정을 변경하세요.
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>주의:</strong> 강제 변경 시 기존 기본 계정의 파일들이 다른 계정에 동기화되지 않을 수 있습니다.
                    </p>
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>취소</AlertDialogCancel>
            {syncWarning && (
              <>
                <AlertDialogAction
                  onClick={handleSyncFirst}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  먼저 동기화 실행
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={handleForceChange}
                  className="bg-red-600 hover:bg-red-700"
                >
                  강제 변경
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}