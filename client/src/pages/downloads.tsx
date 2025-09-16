import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  FileText, 
  Monitor,
  Smartphone,
  HardDrive,
  Calendar,
  FileDown,
  Eye,
  Loader2
} from "lucide-react";
import type { Download as DownloadType } from "@shared/schema";

const categoryIcons = {
  "ott-plus": <Smartphone className="h-6 w-6" />,
  "streamplayer": <Monitor className="h-6 w-6" />,
  "nohard": <HardDrive className="h-6 w-6" />,
  "manual": <FileText className="h-6 w-6" />,
  "other": <FileText className="h-6 w-6" />
};

const categoryColors = {
  "ott-plus": "text-blue-600",
  "streamplayer": "text-green-600", 
  "nohard": "text-purple-600",
  "manual": "text-orange-600",
  "other": "text-gray-600"
};

const categoryLabels = {
  "ott-plus": "OTT PLUS",
  "streamplayer": "StreamPlayer",
  "nohard": "NoHard System",
  "manual": "사용자 매뉴얼",
  "other": "기타"
};

export default function Downloads() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // 다운로드 진행 상태 관리
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

  // Fetch downloads from API
  const { data: downloads = [], isLoading } = useQuery<DownloadType[]>({
    queryKey: ["/api/downloads"]
  });

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



  const handleDownload = async (download: DownloadType) => {
    // 이미 다운로드 중인 파일은 중복 실행 방지
    if (downloadingFiles.has(download.id)) {
      return;
    }

    // 다운로드 진행 상태 시작
    setDownloadingFiles(prev => new Set(prev).add(download.id));
    
    try {
      // 다운로드 카운트 증가
      incrementMutation.mutate(download.id);
      
      // Google Drive 파일의 경우 서버 처리 시간 안내
      if (download.googleDriveFileId) {
        toast({
          title: "다운로드 시작",
          description: `${download.fileName} 파일을 준비 중입니다. 잠시만 기다려 주세요...`,
          variant: "default"
        });
      } else {
        toast({
          title: "다운로드 시작",
          description: `${download.fileName} 다운로드를 시작합니다.`,
          variant: "default"
        });
      }
      
      // 브라우저 다운로드 다이얼로그를 위한 top-level navigation
      let downloadUrl: string;
      
      if (download.googleDriveFileId) {
        // Google Drive 파일은 API를 통해 다운로드
        downloadUrl = `/api/downloads/${download.id}/download`;
      } else {
        // 로컬 파일은 직접 다운로드
        downloadUrl = download.downloadUrl;
      }
      
      // File System Access API를 사용한 브라우저 네이티브 저장 다이얼로그
      if ((window as any).showSaveFilePicker) {
        try {
          // 크롬/엣지: 네이티브 저장 다이얼로그 표시
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: download.fileName,
            types: [{
              description: '파일',
              accept: { '*/*': ['.exe', '.zip', '.pdf', '.txt'] }
            }]
          });
          
          toast({
            title: "다운로드 진행 중",
            description: `${download.fileName} 파일을 다운로드하는 중입니다...`,
            variant: "default"
          });
          
          // 파일 스트림 다운로드
          const writableStream = await fileHandle.createWritable();
          const response = await fetch(downloadUrl);
          
          if (!response.ok) {
            throw new Error('다운로드 실패');
          }
          
          await response.body!.pipeTo(writableStream);
          
          toast({
            title: "다운로드 완료",
            description: `${download.fileName} 파일이 성공적으로 저장되었습니다.`,
            variant: "default"
          });
          
        } catch (error: any) {
          if (error.name === 'AbortError') {
            toast({
              title: "다운로드 취소",
              description: "사용자가 다운로드를 취소했습니다.",
              variant: "default"
            });
          } else {
            throw error;
          }
        }
      } else {
        // 사파리/파이어폭스: 폴백 안내 메시지
        toast({
          title: "브라우저 제한",
          description: "이 브라우저에서는 저장 다이얼로그를 표시할 수 없습니다. Chrome 또는 Edge를 사용하시거나, 브라우저 설정에서 '다운로드 전 저장 위치 묻기'를 활성화해주세요.",
          variant: "destructive",
          duration: 8000
        });
        
        // 폴백: 기존 방식으로 다운로드
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = download.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Google Drive 파일의 경우 추가 안내
      if (download.googleDriveFileId) {
        setTimeout(() => {
          toast({
            title: "다운로드 진행 중",
            description: "대용량 파일의 경우 1-2분 정도 소요될 수 있습니다.",
            variant: "default"
          });
        }, 3000);
      }

    } catch (error) {
      console.error('다운로드 오류:', error);
      toast({
        title: "다운로드 실패",
        description: "파일 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      // 다운로드 상태 해제 (5초 후)
      setTimeout(() => {
        setDownloadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(download.id);
          return newSet;
        });
      }, 5000);
    }
  };



  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 카테고리별 버튼 색상 (카테고리 표시 색상과 일치)
  const getCategoryButtonStyle = (category: string) => {
    switch (category) {
      case "streamplayer":
        return { 
          backgroundColor: '#16a34a', // green-600 - 카테고리 표시와 일치
          borderColor: '#16a34a',
          color: 'white',
          '&:hover': { backgroundColor: '#15803d' } // green-700
        };
      case "ott-plus":
        return { 
          backgroundColor: '#2563eb', // blue-600 - 카테고리 표시와 일치
          borderColor: '#2563eb',
          color: 'white',
          '&:hover': { backgroundColor: '#1d4ed8' } // blue-700
        };
      case "nohard":
        return { 
          backgroundColor: '#9333ea', // purple-600 - 카테고리 표시와 일치
          borderColor: '#9333ea',
          color: 'white',
          '&:hover': { backgroundColor: '#7c3aed' } // purple-700
        };
      case "manual":
        return { 
          backgroundColor: '#ea580c', // orange-600 - 카테고리 표시와 일치
          borderColor: '#ea580c',
          color: 'white',
          '&:hover': { backgroundColor: '#dc2626' } // orange-700
        };
      case "other":
        return { 
          backgroundColor: '#4b5563', // gray-600 - 카테고리 표시와 일치
          borderColor: '#4b5563',
          color: 'white',
          '&:hover': { backgroundColor: '#374151' } // gray-700
        };
      default:
        return { 
          backgroundColor: '#4b5563', // gray-600 기본값
          borderColor: '#4b5563',
          color: 'white',
          '&:hover': { backgroundColor: '#374151' }
        };
    }
  };

  const groupedDownloads = downloads.reduce((acc, download) => {
    const category = download.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(download);
    return acc;
  }, {} as Record<string, DownloadType[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-downloads-title">
            다운로드
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            PC용 통합OTT 프로그램, 유틸리티 등 필요한 파일을 다운로드하세요
          </p>
        </div>
      </section>
      
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* No Downloads */}
          {!isLoading && downloads.length === 0 && (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">다운로드 파일이 없습니다</h3>
              <p className="text-gray-600">관리자가 파일을 업로드하면 여기에 표시됩니다.</p>
            </div>
          )}

          {/* Downloads by Category */}
          {!isLoading && Object.keys(groupedDownloads).length > 0 && (
            <div className="space-y-12">
              {Object.entries(groupedDownloads).map(([category, categoryDownloads]) => (
                <div key={category} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`${categoryColors[category as keyof typeof categoryColors] || categoryColors.other}`}>
                      {categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.other}
                    </div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">
                      {categoryLabels[category as keyof typeof categoryLabels] || category}
                    </h2>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {categoryDownloads.length}개 파일
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryDownloads.map((download) => (
                      <Card
                        key={download.id}
                        className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group"
                        data-testid={`download-card-${download.id}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`${categoryColors[download.category as keyof typeof categoryColors] || categoryColors.other}`}>
                              {categoryIcons[download.category as keyof typeof categoryIcons] || categoryIcons.other}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                                {download.title}
                              </h3>

                              {download.description && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                  {download.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                {download.version && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {download.version}
                                  </Badge>
                                )}
                                {download.version && <span>•</span>}
                                <span>{formatFileSize(download.fileSize)}</span>
                                {download.downloadCount > 0 && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <Eye className="h-3 w-3" />
                                      <span>{download.downloadCount}회</span>
                                    </div>
                                  </>
                                )}
                              </div>
                              {download.createdAt && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(download.createdAt).toLocaleDateString("ko-KR")}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <Button
                            onClick={() => handleDownload(download)}
                            disabled={incrementMutation.isPending || downloadingFiles.has(download.id)}
                            className="w-full transition-all duration-300"
                            style={getCategoryButtonStyle(download.category)}
                            data-testid={`button-download-${download.id}`}
                          >
                            {downloadingFiles.has(download.id) ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                다운로드 준비 중...
                              </>
                            ) : (
                              <>
                                <FileDown className="h-4 w-4 mr-2" />
                                다운로드
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-16 text-center">
            <Card className="bg-white border border-gray-200 shadow-lg max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  도움이 필요하신가요?
                </h3>
                <p className="text-gray-600 mb-6">
                  설치나 사용에 문제가 있으시면 언제든 문의해주세요
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <a href="/contact" data-testid="button-contact-help">
                    고객지원 문의
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}