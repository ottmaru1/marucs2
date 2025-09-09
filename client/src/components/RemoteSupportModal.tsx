import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download as DownloadIcon, 
  FileDown,
  Monitor,
  Eye,
  Calendar,
  X
} from "lucide-react";
import type { Download as DownloadType } from "@shared/schema";

interface RemoteSupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RemoteSupportModal({ open, onOpenChange }: RemoteSupportModalProps) {
  const queryClient = useQueryClient();

  // Fetch downloads from API
  const { data: downloads = [], isLoading } = useQuery<DownloadType[]>({
    queryKey: ["/api/downloads"]
  });

  // Filter remote support files (원격지원 관련 파일들)
  const remoteSupportFiles = downloads.filter(download => 
    download.title.toLowerCase().includes('원격') || 
    download.title.toLowerCase().includes('remote') ||
    download.category === 'remote-support' ||
    download.description?.toLowerCase().includes('원격')
  );

  // Increment download count
  const incrementMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/downloads/${id}/increment`, {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error("Failed to increment download count");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/downloads"] });
    }
  });

  const handleDownload = (download: DownloadType) => {
    incrementMutation.mutate(download.id);
    
    // 바이러스 스캔 우회를 위해 Google Drive 파일은 API 엔드포인트 사용
    const downloadUrl = download.googleDriveFileId 
      ? `/api/downloads/${download.id}/download` // Google Drive 파일은 우회 API 사용
      : download.downloadUrl; // 로컬 파일은 기존 URL 사용
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = download.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden [&>button]:hidden bg-white border-gray-200">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Monitor className="text-white h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-2xl text-gray-900">원격지원 프로그램</DialogTitle>
                <DialogDescription className="text-gray-600">
                  원격지원을 위한 프로그램을 다운로드하세요
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] pr-2">
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!isLoading && remoteSupportFiles.length === 0 && (
            <div className="text-center py-12">
              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">원격지원 파일이 없습니다</h3>
              <p className="text-gray-600">원격지원 프로그램이 준비되는 대로 업데이트됩니다.</p>
            </div>
          )}

          {!isLoading && remoteSupportFiles.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {remoteSupportFiles.map((download) => (
                <Card
                  key={download.id}
                  className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-blue-600 flex-shrink-0">
                        <Monitor className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                          {download.title}
                        </h3>

                        {download.description && (
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                            {download.description}
                          </p>
                        )}

                        {download.version && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                              {download.version}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => handleDownload(download)}
                        disabled={incrementMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                        data-testid={`button-remote-download-${download.id}`}
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        다운로드
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 원격지원 안내 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">원격지원 안내</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 원격지원 프로그램을 다운로드하여 설치해주세요</li>
              <li>• 설치 후 고객지원팀에 연락하여 지원을 요청하세요</li>
              <li>• 문의: 1588-0000 (평일 09:00-18:00)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}