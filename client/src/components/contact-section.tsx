import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";

export function ContactSection() {
  const { toast } = useToast();
  
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

  const contactMutation = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      const response = await apiRequest("/api/inquiries", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "문의 접수 완료",
        description: data.message,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "문의 접수 실패",
        description: error.message || "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInquiry) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">문의하기</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            프로젝트에 대한 문의나 상담이 필요하시면 언제든지 연락해 주세요. 
            전문가가 신속하게 답변 드리겠습니다.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-brand-blue to-brand-sky p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">연락처 정보</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">주소</p>
                    <p className="text-blue-100">서울특별시 강남구 테헤란로 123</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">전화번호</p>
                    <p className="text-blue-100">02-1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">이메일</p>
                    <p className="text-blue-100">contact@protech.co.kr</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">운영시간</p>
                    <p className="text-blue-100">평일 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white border-opacity-20">
                <p className="font-medium mb-4">소셜 미디어</p>
                <div className="flex space-x-4">
                  <button className="bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition-colors" data-testid="social-facebook">
                    <Facebook className="text-white" size={20} />
                  </button>
                  <button className="bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition-colors" data-testid="social-twitter">
                    <Twitter className="text-white" size={20} />
                  </button>
                  <button className="bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition-colors" data-testid="social-linkedin">
                    <Linkedin className="text-white" size={20} />
                  </button>
                  <button className="bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition-colors" data-testid="social-instagram">
                    <Instagram className="text-white" size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-gray p-8 rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80" 
                alt="Professional handshake" 
                className="rounded-xl w-full h-auto mb-4"
              />
              <h4 className="text-xl font-bold text-slate-800 mb-2">신뢰할 수 있는 파트너십</h4>
              <p className="text-slate-600">고객과의 장기적인 신뢰관계를 바탕으로 최고의 서비스를 제공합니다.</p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름 *</FormLabel>
                        <FormControl>
                          <Input placeholder="성명을 입력하세요" {...field} data-testid="input-name" />
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
                          <Input type="email" placeholder="이메일을 입력하세요" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>전화번호</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="연락처를 입력하세요" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>회사명</FormLabel>
                        <FormControl>
                          <Input placeholder="회사명을 입력하세요" {...field} data-testid="input-company" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger data-testid="select-service">
                            <SelectValue placeholder="서비스를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cloud">클라우드 솔루션</SelectItem>
                          <SelectItem value="app">앱 개발</SelectItem>
                          <SelectItem value="ai">AI/ML 솔루션</SelectItem>
                          <SelectItem value="custom">맞춤형 솔루션</SelectItem>
                          <SelectItem value="consulting">기술 컨설팅</SelectItem>
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
                      <FormLabel>프로젝트 설명 *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="프로젝트에 대한 상세한 내용을 입력해 주세요" 
                          className="resize-none" 
                          rows={5}
                          {...field} 
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="privacy" data-testid="checkbox-privacy" />
                  <label htmlFor="privacy" className="text-sm text-slate-600">
                    개인정보처리방침에 동의합니다. *
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-brand-blue text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit"
                >
                  {contactMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={16} />
                      문의 보내기
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-slate-500 text-center">
                  문의를 보내시면 24시간 내에 답변 드리겠습니다.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
