import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Trash2, Edit, FileText, Settings, ArrowLeft, Home, ArrowUp, ArrowDown, GripVertical, DollarSign, Menu, X, LogOut, Plus, Monitor, Tv, Shield, Cloud, AlertCircle, HardDrive } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Download as DownloadType, ServicePackage, StreamplayerOption } from "@shared/schema";
import { useAdminAuth } from "@/components/admin/admin-auth-provider";
import GoogleDriveManager from "./google-drive-manager";

// Upload form schema
const uploadSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  version: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

// Edit form schema (similar to upload but all fields optional except title and category)
const editSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  version: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

// Pricing schemas
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

// Password change schema
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: z.string().min(4, "새 비밀번호는 최소 4자 이상이어야 합니다"),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

// Backup Manager Component
function BackupManager() {
  const [backupFiles, setBackupFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // 현재 날짜로 폴더명 생성
  const today = new Date();
  const folderName = `Replit-Backup-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 서버의 백업 파일 목록 조회
  const { data: serverBackupFiles, refetch } = useQuery({
    queryKey: ['/api/server-backup-files'],
    queryFn: async () => {
      const response = await apiRequest('/api/server-backup-files');
      return response.files || [];
    },
  });

  // 백업 파일을 Google Drive로 복사
  const handleBackupToGoogleDrive = async (fileName: string, filePath: string) => {
    setUploadingFiles(prev => new Set([...prev, fileName]));

    try {
      const response = await apiRequest('/api/google-drive/upload-backup', {
        method: 'POST',
        body: {
          fileName,
          filePath,
          folderName
        },
      });

      if (response.success) {
        toast({
          title: "백업 성공",
          description: `${fileName}이(가) Google Drive에 성공적으로 백업되었습니다.`,
        });
      } else {
        throw new Error(response.details || '백업 실패');
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "백업 실패",
        description: error instanceof Error ? error.message : "백업 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileName);
        return newSet;
      });
    }
  };

  // 모든 백업 파일을 한번에 Google Drive로 복사
  const handleBackupAll = async () => {
    if (!serverBackupFiles || serverBackupFiles.length === 0) return;

    for (const file of serverBackupFiles) {
      if (!uploadingFiles.has(file.name)) {
        await handleBackupToGoogleDrive(file.name, file.path);
        // 연속 업로드 시 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-lg">
      <CardHeader className="pb-6 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <HardDrive className="h-5 w-5 text-blue-600" />
          서버 백업 파일 관리
        </CardTitle>
        <p className="text-gray-600">
          서버에 저장된 백업 파일들을 Google Drive로 직접 복사할 수 있습니다. 다운로드 없이 서버-to-서버로 백업됩니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">서버 백업 파일 목록</h3>
            {serverBackupFiles && serverBackupFiles.length > 0 && (
              <Button
                onClick={handleBackupAll}
                disabled={uploadingFiles.size > 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {uploadingFiles.size > 0 ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    백업 중...
                  </>
                ) : (
                  <>
                    <Cloud className="h-4 w-4 mr-2" />
                    전체 백업
                  </>
                )}
              </Button>
            )}
          </div>

          {serverBackupFiles && serverBackupFiles.length > 0 ? (
            <div className="space-y-3">
              {serverBackupFiles.map((file: any, index: number) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>크기: {file.size}</span>
                        <span>수정일: {file.modified}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBackupToGoogleDrive(file.name, file.path)}
                      disabled={uploadingFiles.has(file.name)}
                      className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
                    >
                      {uploadingFiles.has(file.name) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          백업 중...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          백업
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <HardDrive className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">서버에 백업 파일이 없습니다</h3>
              <p className="text-gray-600 mb-6">
                현재 서버에 백업 파일(.tar.gz, .zip, .7z, .rar, merged, split 등)이 존재하지 않습니다.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
                <h4 className="font-medium text-blue-900 mb-2">백업 파일을 만드는 방법:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 프로젝트 전체 백업: tar -czf backup.tar.gz .</li>
                  <li>• 특정 폴더 백업: tar -czf files-backup.tar.gz 폴더명</li>
                  <li>• ZIP 형식: zip -r backup.zip .</li>
                </ul>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-blue-800 font-medium">백업 방식</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• 서버에서 Google Drive로 직접 복사 (다운로드 부하 없음)</li>
                  <li>• 백업된 파일은 Google Drive의 "{folderName}" 폴더에 저장됩니다</li>
                  <li>• 2GB 이하의 파일만 백업 가능합니다</li>
                  <li>• 전체 백업 시 파일들이 순차적으로 백업됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const categories = [
  { value: "ott-plus", label: "OTT PLUS" },
  { value: "streamplayer", label: "StreamPlayer" },
  { value: "nohard", label: "NoHard 시스템" },
  { value: "manual", label: "설치 매뉴얼" },
  { value: "other", label: "기타" }
];

const categoryColors = {
  "ott-plus": "bg-blue-100 text-blue-800 border-blue-200",
  "streamplayer": "bg-green-100 text-green-800 border-green-200", 
  "nohard": "bg-purple-100 text-purple-800 border-purple-200",
  "manual": "bg-orange-100 text-orange-800 border-orange-200",
  "other": "bg-gray-100 text-gray-800 border-gray-200"
};

const categoryIcons = {
  "ott-plus": Tv,
  "streamplayer": Monitor,
  "nohard": Settings,
  "manual": FileText,
  "other": FileText
};

export default function AdminContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logout } = useAdminAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [editingDownload, setEditingDownload] = useState<DownloadType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("upload");
  const [location] = useLocation();
  
  // Pricing states
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [editingOption, setEditingOption] = useState<StreamplayerOption | null>(null);
  
  // Password change states
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch downloads
  const { data: downloads = [], isLoading: downloadsLoading } = useQuery<DownloadType[]>({
    queryKey: ["/api/downloads"]
  });

  // Fetch Google Drive accounts
  const { data: googleAccounts = [], isLoading: isLoadingAccounts } = useQuery<any[]>({
    queryKey: ["/api/auth/google/accounts"],
  });

  // Fetch pricing data
  const { data: servicePackages = [], isLoading: isLoadingPackages } = useQuery<ServicePackage[]>({
    queryKey: ["/api/service-packages"],
  });

  const { data: streamplayerOptions = [], isLoading: isLoadingOptions } = useQuery<StreamplayerOption[]>({
    queryKey: ["/api/streamplayer-options"],
  });

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      version: "",
    },
  });

  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  // Pricing forms
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

  // Password change form
  const passwordForm = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      console.log("🌐 서버로 업로드 요청 전송 중...");
      
      const response = await fetch("/api/downloads/google-drive", {
        method: "POST",
        body: data,
      });
      
      console.log("📡 서버 응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ 서버 오류:", errorText);
        throw new Error(errorText || "Google Drive 업로드에 실패했습니다");
      }
      
      const result = await response.json();
      console.log("✅ 업로드 성공 응답:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("🎉 업로드 완전 성공:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/downloads"] });
      form.reset();
      setSelectedFile(null);
      setSelectedAccount("");
      toast({
        title: "업로드 완료",
        description: "파일이 Google Drive에 성공적으로 업로드되었습니다.",
      });
    },
    onError: (error: Error) => {
      console.error("💥 업로드 실패:", error);
      toast({
        title: "업로드 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/downloads/${id}`, { method: "DELETE" });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/downloads"] });
      toast({
        title: "삭제 완료",
        description: "파일이 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 구글 드라이브 마이그레이션 mutation
  const migrateMutation = useMutation({
    mutationFn: async ({ downloadId, accountId }: { downloadId: string; accountId: string }) => {
      const response = await apiRequest(`/api/downloads/${downloadId}/migrate-to-drive`, {
        method: "POST",
        body: { accountId },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/downloads"] });
      toast({
        title: "마이그레이션 완료",
        description: "파일이 Google Drive로 성공적으로 이전되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "마이그레이션 실패", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EditFormData }) => {
      const response = await apiRequest(`/api/downloads/${id}`, { method: "PUT", body: data });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/downloads"] });
      setEditDialogOpen(false);
      setEditingDownload(null);
      toast({
        title: "수정 완료",
        description: "파일 정보가 성공적으로 수정되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "수정 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sortMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      const response = await apiRequest(`/api/downloads/${id}/sort`, { method: "PUT", body: { direction } });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/downloads"] });
    },
    onError: (error: Error) => {
      toast({
        title: "정렬 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Pricing mutations
  const createPackageMutation = useMutation({
    mutationFn: async (data: ServicePackageForm) => {
      const response = await apiRequest("/api/service-packages", { method: "POST", body: data });
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
      const response = await apiRequest(`/api/service-packages/${id}`, { method: "PUT", body: data });
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
      const response = await apiRequest(`/api/service-packages/${id}`, { method: "DELETE" });
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
      console.log("Creating option with data:", data);
      const result = await apiRequest("/api/streamplayer-options", { method: "POST", body: data });
      console.log("API response:", result);
      return result;
    },
    onSuccess: (result) => {
      console.log("Create option success:", result);
      toast({ title: "성공", description: "스트림플레이어 옵션이 생성되었습니다." });
      setIsOptionDialogOpen(false);
      optionForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/streamplayer-options"] });
    },
    onError: (error) => {
      console.error("Create option error:", error);
      toast({ title: "오류", description: "스트림플레이어 옵션 생성에 실패했습니다.", variant: "destructive" });
    },
  });

  const updateOptionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StreamplayerOptionForm> }) => {
      console.log("Updating option with id:", id, "data:", data);
      const result = await apiRequest(`/api/streamplayer-options/${id}`, { method: "PUT", body: data });
      console.log("Update API response:", result);
      return result;
    },
    onSuccess: (result) => {
      console.log("Update option success:", result);
      toast({ title: "성공", description: "스트림플레이어 옵션이 수정되었습니다." });
      setIsOptionDialogOpen(false);
      setEditingOption(null);
      optionForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/streamplayer-options"] });
    },
    onError: (error) => {
      console.error("Update option error:", error);
      toast({ title: "오류", description: "스트림플레이어 옵션 수정에 실패했습니다.", variant: "destructive" });
    },
  });

  const deleteOptionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/streamplayer-options/${id}`, { method: "DELETE" });
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

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest("/api/admin/change-password", { method: "POST", body: data });
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "성공", 
        description: `비밀번호 검증 완료. 새 비밀번호: ${data.newPassword}. Secrets 탭에서 ADMIN_PASSWORD를 업데이트해주세요.`,
        duration: 10000
      });
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "오류", description: error.message, variant: "destructive" });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    console.log("🚀 업로드 폼 제출 시작:", data);
    
    if (!selectedFile) {
      console.log("❌ 파일 미선택");
      toast({
        title: "파일 선택 필요",
        description: "업로드할 파일을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAccount) {
      console.log("❌ 계정 미선택");
      toast({
        title: "계정 선택 필요",
        description: "업로드할 Google Drive 계정을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    console.log("📤 업로드 준비:", {
      file: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      account: selectedAccount
    });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("category", data.category);
      formData.append("version", data.version || "");
      formData.append("accountId", selectedAccount);

      console.log("📡 업로드 요청 시작...");
      uploadMutation.mutate(formData);
    } catch (error) {
      console.error("❌ 업로드 폼 처리 오류:", error);
    }
  };

  const handleEdit = (download: DownloadType) => {
    setEditingDownload(download);
    editForm.reset({
      title: download.title,
      description: download.description || "",
      category: download.category,
      version: download.version || "",
    });
    setEditDialogOpen(true);
  };

  const onEditSubmit = async (data: EditFormData) => {
    if (!editingDownload) return;
    editMutation.mutate({ id: editingDownload.id, data });
  };

  const handleDelete = (id: string) => {
    if (confirm("정말로 이 파일을 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleMigrateToGoogleDrive = (downloadId: string, fileName: string) => {
    // 활성 상태인 Google Drive 계정만 필터링
    const activeAccounts = googleAccounts.filter(account => account.isActive);
    
    if (activeAccounts.length === 0) {
      toast({
        title: "Google Drive 계정 없음",
        description: "활성화된 Google Drive 계정이 없습니다. 먼저 계정을 연결해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 계정이 하나만 있으면 바로 사용, 여러개면 선택
    let selectedAccountId: string;
    
    if (activeAccounts.length === 1) {
      selectedAccountId = activeAccounts[0].id;
    } else {
      const accountOptions = activeAccounts.map(acc => `${acc.accountName} (${acc.email})`).join('\n');
      const selectedIndex = window.prompt(
        `Google Drive 계정을 선택하세요:\n\n${accountOptions}\n\n번호를 입력하세요 (1-${activeAccounts.length}):`
      );
      
      const index = parseInt(selectedIndex || '0') - 1;
      if (index < 0 || index >= activeAccounts.length) {
        toast({
          title: "잘못된 선택",
          description: "올바른 계정 번호를 선택해주세요.",
          variant: "destructive",
        });
        return;
      }
      selectedAccountId = activeAccounts[index].id;
    }

    // 확인 대화상자
    const confirmed = window.confirm(
      `'${fileName}' 파일을 Google Drive로 이전하시겠습니까?\n\n이전 후에는 Google Drive에서 다운로드됩니다.`
    );
    
    if (confirmed) {
      migrateMutation.mutate({ downloadId, accountId: selectedAccountId });
    }
  };

  const handleBulkMigrate = async () => {
    const localFiles = downloads?.filter(d => !d.googleDriveFileId) || [];
    
    if (localFiles.length === 0) {
      toast({
        title: "마이그레이션할 파일 없음",
        description: "로컬 저장소에 있는 파일이 없습니다.",
      });
      return;
    }

    const activeAccounts = googleAccounts.filter(account => account.isActive);
    
    if (activeAccounts.length === 0) {
      toast({
        title: "Google Drive 계정 없음",
        description: "활성화된 Google Drive 계정이 없습니다. 먼저 계정을 연결해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 계정 선택
    let selectedAccountId: string;
    
    if (activeAccounts.length === 1) {
      selectedAccountId = activeAccounts[0].id;
    } else {
      const accountOptions = activeAccounts.map((acc, idx) => `${idx + 1}. ${acc.accountName} (${acc.email})`).join('\n');
      const selectedIndex = window.prompt(
        `Google Drive 계정을 선택하세요:\n\n${accountOptions}\n\n번호를 입력하세요 (1-${activeAccounts.length}):`
      );
      
      const index = parseInt(selectedIndex || '0') - 1;
      if (index < 0 || index >= activeAccounts.length) {
        toast({
          title: "잘못된 선택",
          description: "올바른 계정 번호를 선택해주세요.",
          variant: "destructive",
        });
        return;
      }
      selectedAccountId = activeAccounts[index].id;
    }

    // 확인 대화상자
    const confirmed = window.confirm(
      `${localFiles.length}개의 로컬 파일을 Google Drive로 일괄 이전하시겠습니까?\n\n이 작업은 시간이 소요될 수 있습니다.`
    );
    
    if (!confirmed) return;

    // 순차적으로 마이그레이션 수행
    for (const file of localFiles) {
      try {
        await new Promise<void>((resolve, reject) => {
          migrateMutation.mutate(
            { downloadId: file.id, accountId: selectedAccountId },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            }
          );
        });
        
        // 각 파일 마이그레이션 사이에 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`파일 마이그레이션 실패: ${file.fileName}`, error);
        toast({
          title: "마이그레이션 중 오류",
          description: `${file.fileName} 파일 마이그레이션 중 오류가 발생했습니다.`,
          variant: "destructive",
        });
        break;
      }
    }
  };

  const moveSortOrder = (id: string, direction: 'up' | 'down') => {
    sortMutation.mutate({ id, direction });
  };

  // Pricing handlers
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

  // Password change handler
  const onPasswordSubmit = (data: PasswordChangeForm) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const menuItems = [
    {
      id: "upload",
      label: "파일 업로드",
      description: "새 파일 업로드",
      icon: Upload,
    },
    {
      id: "manage",
      label: "파일 관리",
      description: "업로드된 파일 관리",
      icon: FileText,
    },
    {
      id: "googledrive",
      label: "구글 드라이브",
      description: "클라우드 스토리지 관리",
      icon: Cloud,
    },
    {
      id: "backup",
      label: "백업 관리",
      description: "백업 파일 업로드",
      icon: HardDrive,
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
      // External navigation - use window.location for full page reload
      window.location.href = item.href;
    } else {
      setActiveSection(item.id);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-xl flex-shrink-0 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
            <h2 className="text-lg font-bold">관리자페이지</h2>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-blue-700 p-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href ? location === item.href : activeSection === item.id;
              
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
          
          {/* Admin actions section */}
          <div className="p-3 border-t border-gray-200 space-y-2">
            <Button
              variant="ghost"
              onClick={() => setIsPasswordDialogOpen(true)}
              className="w-full justify-start px-3 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-sm"
              data-testid="button-change-password"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="font-medium text-xs">비밀번호 변경</span>
            </Button>
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
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">
            {activeSection === "upload" && "파일 업로드"}
            {activeSection === "manage" && "파일 관리"}
            {activeSection === "googledrive" && "구글 드라이브"}
            {activeSection === "backup" && "백업 관리"}
            {activeSection === "pricing" && "가격 관리"}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-3 lg:p-6">
            <div className="w-full max-w-none lg:max-w-7xl lg:mx-auto">
              {/* Section Title - Hidden on mobile (shown in mobile header) */}
              <div className="mb-8 hidden lg:block">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {activeSection === "upload" && "파일 업로드"}
                  {activeSection === "manage" && "파일 관리"}
                  {activeSection === "googledrive" && "구글 드라이브 관리"}
                  {activeSection === "backup" && "백업 파일 관리"}
                  {activeSection === "pricing" && "서비스 가격 관리"}
                </h1>
                <p className="text-gray-600 text-lg">
                  {activeSection === "upload" && "새 파일을 업로드하여 사용자에게 제공하세요"}
                  {activeSection === "manage" && "업로드된 파일을 편집, 삭제 및 관리하세요"}
                  {activeSection === "googledrive" && "구글 드라이브 계정을 연동하고 관리하세요"}
                  {activeSection === "backup" && "백업 파일을 Google Drive에 업로드하여 안전하게 보관하세요"}
                  {activeSection === "pricing" && "서비스 패키지와 스트림플레이어 옵션의 가격을 설정하세요"}
                </p>
              </div>

              {/* Content based on active section */}
              {activeSection === "upload" && (
              <Card className="bg-white border border-gray-200 shadow-lg min-w-0">
                <CardHeader className="pb-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg lg:text-xl text-gray-900">
                        <Cloud className="h-5 w-5 text-blue-500" />
                        Google Drive에 파일 업로드
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-2">
                        연동된 Google Drive 계정에 파일을 업로드하여 사용자에게 제공하세요
                      </p>
                    </div>
                    {/* 일괄 마이그레이션 버튼 */}
                    {downloads && downloads.filter(d => !d.googleDriveFileId).length > 0 && (
                      <Button
                        onClick={handleBulkMigrate}
                        disabled={migrateMutation.isPending}
                        variant="outline"
                        className="bg-white border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 text-sm lg:text-base whitespace-nowrap"
                      >
                        <Cloud className="h-4 w-4" />
                        <span className="hidden lg:inline">로컬 파일 일괄 마이그레이션</span>
                        <span className="lg:hidden">마이그레이션</span>
                        ({downloads.filter(d => !d.googleDriveFileId).length}개)
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">제목 *</Label>
                        <Input
                          id="title"
                          {...form.register("title")}
                          placeholder="파일 제목을 입력하세요"
                          data-testid="input-title"
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-gray-700">카테고리 *</Label>
                        <Select 
                          onValueChange={(value) => {
                            form.setValue("category", value);
                            form.clearErrors("category");
                          }}
                          value={form.watch("category")}
                        >
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="카테고리를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200">
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value} className="text-gray-900 hover:bg-gray-50">
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.category && (
                          <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="version" className="text-sm font-medium text-gray-700">버전</Label>
                        <Input
                          id="version"
                          {...form.register("version")}
                          placeholder="버전 정보를 입력하세요"
                          data-testid="input-version"
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="account" className="text-sm font-medium text-gray-700">Google Drive 계정 *</Label>
                        <Select 
                          onValueChange={(value) => {
                            setSelectedAccount(value);
                          }}
                          value={selectedAccount}
                        >
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="업로드할 계정을 선택하세요" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200">
                            {googleAccounts.map((account: any) => (
                              <SelectItem key={account.id} value={account.id} className="text-gray-900 hover:bg-gray-50">
                                <div className="flex items-center gap-2">
                                  <Cloud className="h-4 w-4 text-blue-500" />
                                  {account.email}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {googleAccounts.length === 0 && (
                          <p className="text-sm text-amber-600">먼저 구글 드라이브 관리에서 계정을 연동해주세요</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="file" className="text-sm font-medium text-gray-700">파일 선택 *</Label>
                        <Input
                          id="file"
                          type="file"
                          onChange={handleFileChange}
                          data-testid="input-file"
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-10 flex items-center"
                        />
                        {selectedFile && (
                          <div className="text-sm text-gray-600">
                            선택된 파일: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                          </div>
                        )}
                        {!selectedFile && (
                          <p className="text-sm text-gray-500">파일을 선택해주세요</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">설명</Label>
                      <Textarea
                        id="description"
                        {...form.register("description")}
                        placeholder="파일에 대한 설명을 입력하세요"
                        rows={4}
                        data-testid="textarea-description"
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <Button
                        type="submit"
                        disabled={uploadMutation.isPending || googleAccounts.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                        data-testid="button-upload"
                      >
                        {uploadMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Google Drive에 업로드 중...
                          </>
                        ) : (
                          <>
                            <Cloud className="h-4 w-4 mr-2" />
                            Google Drive에 업로드
                          </>
                        )}
                      </Button>
                      
                      {googleAccounts.length === 0 && (
                        <div className="text-sm text-amber-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          구글 드라이브 계정 연동이 필요합니다
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
              )}

              {activeSection === "manage" && (
              <Card className="bg-white border border-gray-200 shadow-lg min-w-0">
                <CardHeader className="pb-6 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl text-gray-900">
                    <FileText className="h-5 w-5 text-blue-600" />
                    업로드된 파일 목록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {downloadsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : downloads.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      업로드된 파일이 없습니다.
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto min-w-0">
                        <Table className="w-full table-fixed lg:table-auto">
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="text-gray-700 font-semibold text-xs px-1 py-2 w-10 lg:w-12">순서</TableHead>
                              <TableHead className="text-gray-700 font-semibold text-xs px-1 py-2 w-32 lg:min-w-[240px] lg:max-w-[260px]">제목</TableHead>
                              <TableHead className="text-gray-700 font-semibold text-xs px-1 py-2 w-12 hidden md:table-cell">카테고리</TableHead>
                              <TableHead className="text-gray-700 font-semibold text-xs px-1 py-2 w-20 lg:min-w-[120px]">파일명</TableHead>
                              <TableHead className="text-gray-700 font-semibold text-xs px-1 py-2 w-12 text-right">크기</TableHead>
                              <TableHead className="text-gray-700 font-semibold text-xs px-1 py-2 w-8 text-center hidden lg:table-cell">DL</TableHead>
                              <TableHead className="text-gray-700 font-semibold text-xs px-1 py-2 w-12 hidden lg:table-cell">저장소</TableHead>
                              <TableHead className="text-gray-700 font-semibold text-xs px-1 py-2 w-16 hidden xl:table-cell">일시</TableHead>
                              <TableHead className="text-center text-gray-700 font-semibold text-xs px-1 py-2 w-16 sticky right-0 bg-gray-50">작업</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {downloads.map((download) => (
                              <TableRow key={download.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <TableCell className="px-1 py-2">
                                  <div className="flex items-center justify-center">
                                    <span className="text-xs font-mono text-gray-700 w-6 text-center hidden lg:inline">{download.sortOrder || 0}</span>
                                    <div className="flex flex-col gap-px lg:ml-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => moveSortOrder(download.id, 'up')}
                                        disabled={sortMutation.isPending}
                                        className="h-2 w-4 lg:h-3 lg:w-3 p-0 text-xs border-gray-300 bg-white hover:bg-blue-50"
                                        data-testid={`button-move-up-${download.id}`}
                                      >
                                        <ArrowUp className="h-1 w-1 lg:h-1.5 lg:w-1.5" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => moveSortOrder(download.id, 'down')}
                                        disabled={sortMutation.isPending}
                                        className="h-2 w-4 lg:h-3 lg:w-3 p-0 text-xs border-gray-300 bg-white hover:bg-blue-50"
                                        data-testid={`button-move-down-${download.id}`}
                                      >
                                        <ArrowDown className="h-1 w-1 lg:h-1.5 lg:w-1.5" />
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="px-1 py-2">
                                  <div className="w-full">
                                    <p className="font-medium text-gray-900 text-xs lg:text-sm leading-tight overflow-hidden whitespace-nowrap text-ellipsis" 
                                       title={download.title}>
                                      {download.title.length > 20 ? download.title.substring(0, 20) + '...' : download.title}
                                    </p>
                                    {download.description && (
                                      <p className="text-xs text-gray-500 leading-tight mt-0.5 overflow-hidden whitespace-nowrap text-ellipsis hidden lg:block" 
                                         title={download.description}>
                                        {download.description}
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="px-1 py-3 hidden md:table-cell">
                                  <Badge variant="secondary" className={`text-xs px-1 py-0.5 ${categoryColors[download.category as keyof typeof categoryColors] || categoryColors.other} border`}>
                                    {categories.find(cat => cat.value === download.category)?.label?.slice(0, 2) || download.category.slice(0, 2)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-1 py-2">
                                  <div className="w-full">
                                    <p className="font-mono text-xs text-gray-700 leading-snug overflow-hidden whitespace-nowrap text-ellipsis" 
                                       title={download.fileName}>
                                      {download.fileName.length > 15 ? download.fileName.substring(0, 15) + '...' : download.fileName}
                                    </p>
                                    {download.version && (
                                      <p className="text-xs text-gray-500 leading-snug hidden lg:block">v{download.version}</p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="px-1 py-3 text-right">
                                  <span className="text-xs text-gray-600 whitespace-nowrap">{formatFileSize(download.fileSize)}</span>
                                </TableCell>
                                <TableCell className="px-1 py-3 text-center hidden lg:table-cell">
                                  <span className="text-xs font-medium text-gray-700">{download.downloadCount || 0}</span>
                                </TableCell>
                                <TableCell className="px-1 py-3 hidden lg:table-cell">
                                  <div className="flex items-center justify-center" title={download.googleDriveFileId ? "Google Drive" : "로컬 저장소"}>
                                    {download.googleDriveFileId ? (
                                      <Cloud className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <HardDrive className="h-3 w-3 text-gray-500" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="px-1 py-3 hidden xl:table-cell">
                                  <span className="text-xs text-gray-600 whitespace-nowrap">{download.createdAt ? formatDate(download.createdAt.toString()).replace('2025.', '') : '-'}</span>
                                </TableCell>
                                <TableCell className="px-1 py-3 sticky right-0 bg-white">
                                  <div className="flex items-center justify-center gap-0.5">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(download)}
                                      className="h-5 w-5 p-0 text-xs border-gray-300 bg-white hover:bg-blue-50"
                                      data-testid={`button-edit-${download.id}`}
                                      title="편집"
                                    >
                                      <Edit className="h-2 w-2" />
                                    </Button>
                                    {!download.googleDriveFileId && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleMigrateToGoogleDrive(download.id, download.fileName)}
                                        disabled={migrateMutation.isPending}
                                        className="h-5 w-5 p-0 text-xs border-gray-300 bg-white hover:bg-green-50"
                                        data-testid={`button-migrate-${download.id}`}
                                        title="Drive 이전"
                                      >
                                        <Cloud className="h-2 w-2" />
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDelete(download.id)}
                                      disabled={deleteMutation.isPending}
                                      className="h-5 w-5 p-0 text-xs border-gray-300 bg-white hover:bg-red-50"
                                      data-testid={`button-delete-${download.id}`}
                                      title="삭제"
                                    >
                                      <Trash2 className="h-2 w-2" />
                                    </Button>
                                  </div>
                                </TableCell>
                            </TableRow>
                          ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                  )}
                </CardContent>
              </Card>
              )}

              {activeSection === "googledrive" && (
                <GoogleDriveManager />
              )}

              {activeSection === "backup" && (
                <BackupManager />
              )}

              {activeSection === "pricing" && (
                <Tabs defaultValue="packages" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                    <TabsTrigger value="packages" className="text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white">서비스 패키지</TabsTrigger>
                    <TabsTrigger value="options" className="text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white">스트림플레이어 옵션</TabsTrigger>
                  </TabsList>

                  <TabsContent value="packages" className="space-y-6">
                    <Card className="bg-white border border-gray-200 shadow-lg">
                      <CardHeader className="pb-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            서비스 패키지 관리
                          </CardTitle>
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
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                data-testid="button-add-package"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                패키지 추가
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md bg-white border border-gray-200">
                              <DialogHeader>
                                <DialogTitle className="text-gray-900">
                                  {editingPackage ? "패키지 수정" : "새 패키지 추가"}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600">
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
                                        <FormLabel className="text-gray-700">서비스 ID</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                          <FormControl>
                                            <SelectTrigger className="bg-white border-gray-300">
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
                                        <FormLabel className="text-gray-700">서비스 이름</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="bg-white border-gray-300 text-gray-900" />
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
                                        <FormLabel className="text-gray-700">기본 가격 (VAT포함)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            {...field} 
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="bg-white border-gray-300 text-gray-900"
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
                                      onClick={() => setIsPackageDialogOpen(false)}
                                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                      취소
                                    </Button>
                                    <Button 
                                      type="submit" 
                                      disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      {createPackageMutation.isPending || updatePackageMutation.isPending ? "처리 중..." : (editingPackage ? "수정" : "생성")}
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
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
                                <Card key={pkg.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                                  <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                          <IconComponent className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                          <CardTitle className="text-lg text-gray-900">{pkg.name}</CardTitle>
                                          <Badge variant="secondary" className="text-xs mt-1 bg-gray-100 text-gray-700">
                                            {pkg.serviceId}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleEditPackage(pkg)}
                                          className="h-8 w-8 p-0 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => deletePackageMutation.mutate(pkg.id)}
                                          className="h-8 w-8 p-0 text-gray-600 hover:bg-red-50 hover:text-red-600"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {pkg.description && (
                                        <p className="text-sm text-gray-600">{pkg.description}</p>
                                      )}
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">가격</span>
                                        <span className="font-semibold text-lg text-blue-600">
                                          {pkg.basePrice.toLocaleString()}원/{pkg.priceUnit}
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="options" className="space-y-6">
                    <Card className="bg-white border border-gray-200 shadow-lg">
                      <CardHeader className="pb-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                            <Monitor className="h-5 w-5 text-purple-600" />
                            스트림플레이어 옵션 관리
                          </CardTitle>
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
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                옵션 추가
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md bg-white border border-gray-200">
                              <DialogHeader>
                                <DialogTitle className="text-gray-900">
                                  {editingOption ? "옵션 수정" : "새 옵션 추가"}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600">
                                  스트림플레이어 옵션의 정보와 가격을 설정하세요
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...optionForm}>
                                <form onSubmit={optionForm.handleSubmit(onOptionSubmit)} className="space-y-4">
                                  <FormField
                                    control={optionForm.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-gray-700">옵션 이름</FormLabel>
                                        <FormControl>
                                          <Input {...field} className="bg-white border-gray-300 text-gray-900" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={optionForm.control}
                                    name="services"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-gray-700">포함 서비스</FormLabel>
                                        <FormControl>
                                          <div className="space-y-2">
                                            {["Netflix", "Disney+", "TVING", "WATCHA", "YouTube Premium", "Apple TV+"].map((service) => (
                                              <div key={service} className="flex items-center space-x-2">
                                                <input
                                                  type="checkbox"
                                                  id={service}
                                                  checked={Array.isArray(field.value) && field.value.includes(service)}
                                                  onChange={(e) => {
                                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                                    if (e.target.checked) {
                                                      field.onChange([...currentValue, service]);
                                                    } else {
                                                      field.onChange(currentValue.filter((s: string) => s !== service));
                                                    }
                                                  }}
                                                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                />
                                                <label htmlFor={service} className="text-sm text-gray-700">
                                                  {service}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
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
                                        <FormLabel className="text-gray-700">가격 (월)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            {...field} 
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="bg-white border-gray-300 text-gray-900"
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
                                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                      취소
                                    </Button>
                                    <Button 
                                      type="submit" 
                                      disabled={createOptionMutation.isPending || updateOptionMutation.isPending}
                                      className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                      {createOptionMutation.isPending || updateOptionMutation.isPending ? "처리 중..." : (editingOption ? "수정" : "생성")}
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
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
                              <Card key={option.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg text-gray-900">{option.name}</CardTitle>
                                    <div className="flex space-x-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditOption(option)}
                                        className="h-8 w-8 p-0 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteOptionMutation.mutate(option.id)}
                                        className="h-8 w-8 p-0 text-gray-600 hover:bg-red-50 hover:text-red-600"
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
                                          <Badge key={service} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
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
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">파일 정보 수정</DialogTitle>
              <DialogDescription className="text-gray-600">
                파일의 제목, 설명, 카테고리 등을 수정할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">제목 *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="파일 제목을 입력하세요" className="bg-white border-gray-300 text-gray-900 focus:border-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">설명</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="파일에 대한 설명을 입력하세요" rows={3} className="bg-white border-gray-300 text-gray-900 focus:border-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">카테고리 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                            <SelectValue placeholder="카테고리를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-gray-200">
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value} className="text-gray-900 hover:bg-gray-50">
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">버전</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="버전 정보를 입력하세요" className="bg-white border-gray-300 text-gray-900 focus:border-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    className="flex-1 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    disabled={editMutation.isPending}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={editMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editMutation.isPending ? "수정 중..." : "수정"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">관리자 비밀번호 변경</DialogTitle>
            <DialogDescription className="text-gray-600">
              현재 비밀번호를 확인하고 새 비밀번호를 설정하세요
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">현재 비밀번호</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white border-gray-300 text-gray-900"
                        placeholder="현재 비밀번호를 입력하세요"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">새 비밀번호</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white border-gray-300 text-gray-900"
                        placeholder="새 비밀번호를 입력하세요 (최소 4자)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white border-gray-300 text-gray-900"
                        placeholder="새 비밀번호를 다시 입력하세요"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>참고:</strong> 비밀번호 변경 후 Replit의 Secrets 탭에서 
                  <code className="bg-yellow-100 px-1 rounded">ADMIN_PASSWORD</code> 
                  환경변수를 새 비밀번호로 업데이트해야 합니다.
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPasswordDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  disabled={changePasswordMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {changePasswordMutation.isPending ? "확인 중..." : "비밀번호 변경"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}