import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare,
  Send,
  Monitor
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
      service: "",
      message: "",
    },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "문의가 접수되었습니다",
        description: "빠른 시일 내에 연락드리겠습니다.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
    },
    onError: (error: any) => {
      toast({
        title: "문의 접수 실패",
        description: error.message || "다시 시도해 주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInquiry) => {
    inquiryMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "대표 전화",
      content: "070-8080-0953",
      description: "평일 10:30 - 17:00"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "이메일",
      content: "marucs@marucs.kr",
      description: "24시간 접수 가능"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "본사 주소",
      content: "경기도 군포시 번영로28번길 45-36",
      description: "1호선 의왕역 1번 출구"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "운영 시간",
      content: "평일 10:30 - 17:00",
      description: "토요일, 일요일, 공휴일 휴무"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-surface py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
            <MessageSquare className="h-10 w-10 text-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground" data-testid="text-contact-title">
            문의하기
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            궁금한 점이 있으시거나 상담이 필요하시면 언제든지 연락해 주세요
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-strong bg-card border-border" data-testid="contact-form-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-card-foreground mb-6">온라인 문의</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>회사명 *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="회사명을 입력하세요" 
                                {...field} 
                                data-testid="input-company-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>담당자명 *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="담당자명을 입력하세요" 
                                {...field}
                                data-testid="input-contact-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>전화번호 *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="010-0000-0000" 
                                {...field}
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>이메일 *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="email@example.com" 
                                {...field}
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>관심 서비스</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger data-testid="select-service">
                                <SelectValue placeholder="서비스를 선택하세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ott-plus">OTT PLUS (셋톱박스)</SelectItem>
                              <SelectItem value="streamplayer">StreamPlayer (PC 프로그램)</SelectItem>
                              <SelectItem value="netflix">넷플릭스 계정 대행</SelectItem>
                              <SelectItem value="nohard">노하드 시스템</SelectItem>
                              <SelectItem value="all">전체 서비스</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>문의 내용 *</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={5}
                              placeholder="문의 내용을 자세히 적어주세요" 
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary-dark"
                      disabled={inquiryMutation.isPending}
                      data-testid="button-submit-inquiry"
                    >
                      {inquiryMutation.isPending ? (
                        "접수 중..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          문의 접수하기
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-strong bg-card border-border" data-testid="contact-info-card">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-card-foreground mb-6">연락처 정보</h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start" data-testid={`contact-info-${index}`}>
                        <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center mr-4 text-foreground shadow-soft">
                          {info.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-card-foreground">{info.title}</div>
                          <div className="text-foreground font-medium">{info.content}</div>
                          <div className="text-muted-foreground text-sm">{info.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface-elevated text-foreground shadow-strong border-border" data-testid="emergency-support-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">24시간 기술 지원</h3>
                  <p className="mb-4">긴급 상황 발생 시 언제든지 연락해 주세요</p>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3" />
                    <span className="text-lg font-semibold">070-8080-0953</span>
                  </div>
                  <div className="mt-4 text-muted-foreground text-sm">
                    시스템 장애, 긴급 복구 등 즉시 대응이 필요한 경우
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-location-title">
              오시는 길
            </h2>
            <p className="text-lg text-muted-foreground">
              직접 방문하여 상담받으실 수 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="shadow-strong bg-card border-border" data-testid="location-info-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-card-foreground mb-6">본사 위치</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-foreground mr-3 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">주소</div>
                      <div className="text-gray-600">경기도 군포시 번영로28번길 45-36</div>
                      <div className="text-gray-600">마루컴시스</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">대중교통</div>
                      <div className="text-gray-600">지하철 1호선 의왕역 1번 출구</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">방문 시간</div>
                      <div className="text-gray-600">평일 10:30 - 17:00 (점심시간 12:00-13:00)</div>
                      <div className="text-gray-600">주말 및 공휴일 휴무</div>
                      <div className="text-red-600 text-sm mt-1">* 방문 전 사전 예약 필수</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="relative">
              {/* 실제 환경에서는 구글 맵이나 네이버 맵 API를 사용 */}
              <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center" data-testid="map-placeholder">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-600">지도 영역</div>
                  <div className="text-sm text-gray-500">실제 환경에서는 지도 API가 표시됩니다</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-additional-services-title">
              추가 지원 서비스
            </h2>
            <p className="text-lg text-gray-600">
              고객 만족을 위한 다양한 지원 서비스를 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="service-remote-demo">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">원격 데모</h3>
                <p className="text-gray-600 text-sm mb-4">
                  화상회의를 통한 실시간 제품 시연 및 상담
                </p>
                <Button variant="outline" className="w-full" data-testid="button-remote-demo">
                  데모 예약하기
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="service-site-visit">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">현장 방문</h3>
                <p className="text-gray-600 text-sm mb-4">
                  전문 컨설턴트가 직접 방문하여 맞춤 상담 제공
                </p>
                <Button variant="outline" className="w-full" data-testid="button-site-visit">
                  방문 상담 신청
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="service-consultation">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-purple-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">무료 컨설팅</h3>
                <p className="text-gray-600 text-sm mb-4">
                  사업장 규모에 맞는 최적의 솔루션 제안
                </p>
                <Button variant="outline" className="w-full" data-testid="button-consultation">
                  컨설팅 요청
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
