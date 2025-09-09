import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Check, Tv, Monitor, Shield, Server } from "lucide-react";
import type { ServicePackage, StreamplayerOption } from "@shared/schema";

interface PriceCalculation {
  service: string;
  unitPrice: number;
  totalPrice: number;
  description: string;
}

export default function PricingGuide() {
  const [businessType, setBusinessType] = useState<string>("");
  const [roomCount, setRoomCount] = useState<string>("");
  const [pcCount, setPcCount] = useState<string>("");
  const [netflixAccountCount, setNetflixAccountCount] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStreamPlayerOption, setSelectedStreamPlayerOption] = useState<string>("");
  const [priceResult, setPriceResult] = useState<PriceCalculation[] | null>(null);

  const { data: servicePackages = [] } = useQuery<ServicePackage[]>({
    queryKey: ["/api/service-packages"],
  });

  const { data: streamPlayerOptions = [] } = useQuery<StreamplayerOption[]>({
    queryKey: ["/api/streamplayer-options"],
  });

  const serviceOptions = servicePackages.map(pkg => ({
    id: pkg.serviceId,
    name: pkg.name,
    price: pkg.basePrice,
    icon: pkg.serviceId === 'ott-plus' ? Tv : 
          pkg.serviceId === 'streamplayer' ? Monitor :
          pkg.serviceId === 'netflix-account' ? Shield : Server,
    color: pkg.serviceId === 'ott-plus' ? "bg-blue-600" :
           pkg.serviceId === 'streamplayer' ? "bg-green-600" :
           pkg.serviceId === 'netflix-account' ? "bg-red-600" : "bg-purple-600"
  }));

  const calculatePrice = () => {
    const rooms = parseInt(roomCount) || 0;
    const pcs = parseInt(pcCount) || 0;
    const netflixAccounts = parseInt(netflixAccountCount) || 0;

    if (!businessType || selectedServices.length === 0) {
      alert("업종과 서비스를 선택해 주세요.");
      return;
    }

    // 각 서비스별 필수 입력값 확인
    if (selectedServices.includes('ott-plus') && rooms === 0) {
      alert("OTT PLUS 서비스를 위해 객실 수를 입력해 주세요.");
      return;
    }

    if (selectedServices.includes('streamplayer') && !selectedStreamPlayerOption) {
      alert("StreamPlayer 옵션을 선택해 주세요.");
      return;
    }

    if (selectedServices.includes('netflix-account') && netflixAccounts === 0) {
      alert("넷플릭스 계정 서비스를 위해 계정 수를 입력해 주세요.");
      return;
    }

    if (selectedServices.includes('nohard-system') && pcs === 0) {
      alert("노하드 시스템을 위해 PC 대수를 입력해 주세요.");
      return;
    }

    const calculations = selectedServices.map(serviceId => {
      let unitPrice = 0;
      let serviceName = "";
      let description = "";
      let totalPrice = 0;

      if (serviceId === 'streamplayer' && selectedStreamPlayerOption) {
        // StreamPlayer 옵션 가격 사용
        const option = streamPlayerOptions.find(opt => opt.id === selectedStreamPlayerOption);
        if (option) {
          unitPrice = option.price;
          serviceName = `StreamPlayer (${option.name})`;
          description = "업소당 월 요금";
          totalPrice = unitPrice; // 업소당 단일 요금
        }
      } else {
        // 일반 서비스 패키지 가격 사용
        const service = serviceOptions.find(s => s.id === serviceId);
        if (service) {
          unitPrice = service.price;
          serviceName = service.name;
          
          // 서비스별 계산 방식
          if (serviceId === 'ott-plus') {
            // OTT PLUS: 셋톱박스 개수 × 단가
            description = `셋톱박스 ${rooms}개 × 월 ${unitPrice.toLocaleString()}원`;
            totalPrice = unitPrice * rooms;
          } else if (serviceId === 'netflix-account') {
            // 넷플릭스 계정: 계정 수 × 단가
            description = `계정 ${netflixAccounts}개 × 월 ${unitPrice.toLocaleString()}원`;
            totalPrice = unitPrice * netflixAccounts;
          } else if (serviceId === 'nohard-system') {
            // 노하드 시스템: 업소당 단일 요금
            description = "업소당 월 요금";
            totalPrice = unitPrice;
          } else {
            // 기타 서비스: 기본 계산
            if (businessType === "hotel") {
              description = `객실당 월 ${unitPrice.toLocaleString()}원`;
            } else {
              description = `PC당 월 ${unitPrice.toLocaleString()}원`;
            }
            totalPrice = unitPrice * rooms;
          }
        }
      }

      if (!serviceName) return null;

      return {
        service: serviceName,
        unitPrice,
        totalPrice,
        description
      };
    }).filter(Boolean) as PriceCalculation[];

    setPriceResult(calculations);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const isRemoving = prev.includes(serviceId);
      if (isRemoving) {
        // StreamPlayer를 해제할 때 옵션도 초기화
        if (serviceId === 'streamplayer') {
          setSelectedStreamPlayerOption("");
        }
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">상품 가격 안내</h2>
          <p className="text-xl text-gray-600">우리 업체에 맞는 서비스 가격을 확인해보세요</p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">업체 정보</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="business-type" className="text-sm font-medium text-gray-700 mb-2 block">
                      업종 선택
                    </Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger data-testid="select-business-type">
                        <SelectValue placeholder="업종을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hotel">숙박업소</SelectItem>
                        <SelectItem value="pcroom">PC방</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="room-count" className="text-sm font-medium text-gray-700 mb-2 block">
                      객실 수 {businessType === "hotel" ? "(숙박업소)" : ""}
                    </Label>
                    <Input
                      id="room-count"
                      type="number"
                      placeholder="예: 20"
                      min="0"
                      max="1000"
                      value={roomCount}
                      onChange={(e) => setRoomCount(e.target.value)}
                      className="bg-white border-gray-300"
                      data-testid="input-room-count"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pc-count" className="text-sm font-medium text-gray-700 mb-2 block">
                      PC 대수 {businessType === "pcroom" ? "(PC방)" : ""}
                    </Label>
                    <Input
                      id="pc-count"
                      type="number"
                      placeholder="예: 30"
                      min="0"
                      max="1000"
                      value={pcCount}
                      onChange={(e) => setPcCount(e.target.value)}
                      className="bg-white border-gray-300"
                      data-testid="input-pc-count"
                    />
                  </div>

                  {selectedServices.includes('netflix-account') && (
                    <div>
                      <Label htmlFor="netflix-count" className="text-sm font-medium text-gray-700 mb-2 block">
                        넷플릭스 계정 수
                      </Label>
                      <Input
                        id="netflix-count"
                        type="number"
                        placeholder="예: 5"
                        min="0"
                        max="100"
                        value={netflixAccountCount}
                        onChange={(e) => setNetflixAccountCount(e.target.value)}
                        className="bg-white border-gray-300"
                        data-testid="input-netflix-count"
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      필요한 서비스 선택
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                      {serviceOptions.map((service) => {
                        const IconComponent = service.icon;
                        const isSelected = selectedServices.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            data-testid={`service-${service.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 ${service.color} rounded-lg flex items-center justify-center mr-3`}>
                                  <IconComponent className="text-white h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{service.name}</div>
                                  <div className="text-sm text-gray-600">월 {service.price.toLocaleString()}원</div>
                                </div>
                              </div>
                              {isSelected && <Check className="h-5 w-5 text-blue-600" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* StreamPlayer 옵션 선택 */}
                  {selectedServices.includes('streamplayer') && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        StreamPlayer 옵션 선택
                      </Label>
                      <Select value={selectedStreamPlayerOption} onValueChange={setSelectedStreamPlayerOption}>
                        <SelectTrigger className="bg-white border-gray-300">
                          <SelectValue placeholder="StreamPlayer 옵션을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {streamPlayerOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{option.name}</span>
                                <span className="ml-4 text-sm text-gray-600">
                                  월 {option.price.toLocaleString()}원
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    onClick={calculatePrice}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    data-testid="button-calculate-price"
                  >
                    가격 계산하기
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">예상 비용</h3>
                
                <div className="bg-gray-50 rounded-xl p-6" data-testid="pricing-result">
                  {priceResult ? (
                    <div>
                      <div className="space-y-4 mb-6">
                        {priceResult.map((item, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900">{item.service}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {businessType === "hotel" ? "숙박업소" : "PC방"}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{item.description}</div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {/* 상세 설명은 위의 description에서 이미 표시되므로 하단에는 간단한 가격만 표시 */}
                                {item.service.includes('StreamPlayer') || item.service.includes('노하드') 
                                  ? `월 ${item.unitPrice.toLocaleString()}원`
                                  : item.service.includes('넷플릭스') 
                                    ? `단가: ${item.unitPrice.toLocaleString()}원`
                                    : `단가: ${item.unitPrice.toLocaleString()}원`
                                }
                              </span>
                              <span className="text-lg font-bold text-blue-600">
                                {item.totalPrice.toLocaleString()}원/월
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-xl font-bold">
                          <span>총 월 비용:</span>
                          <span className="text-blue-600">
                            {priceResult.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          * 가격은 업체 규모와 서비스 옵션에 따라 조정될 수 있습니다.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-600">
                      <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="font-medium text-gray-700">업체 정보와 서비스를 선택하고 계산하기 버튼을 눌러주세요</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">설치 및 설정</span>
                    <span className="text-sm text-blue-600">무료 지원</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">24시간 기술지원</span>
                    <span className="text-sm text-green-600">무료 제공</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">정기 업데이트</span>
                    <span className="text-sm text-purple-600">자동 제공</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
