import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Users, 
  Star,
  Building,
  Monitor,
  MapPin
} from "lucide-react";

export default function SuccessStories() {
  const successStories = [
    {
      id: 1,
      name: "강남 프리미엄 호텔",
      type: "비즈니스 호텔",
      location: "서울 강남구",
      rooms: 120,
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      service: "OTT PLUS",
      beforeProblems: [
        "각종 OTT 리모컨으로 인한 고객 혼란",
        "높은 월 구독료 부담 (월 150만원)",
        "잦은 계정 오류로 인한 고객 불만"
      ],
      afterResults: {
        costSaving: "65%",
        satisfaction: "95%",
        problemReduction: "90%"
      },
      testimonial: "OTT PLUS 도입 후 고객 불만이 90% 줄어들었고, 운영 효율성이 크게 향상되었습니다. 객실 청소 시간도 단축되어 전체적인 운영비 절감 효과가 뛰어납니다.",
      manager: "김호텔 총지배인",
      period: "2023년 3월 도입"
    },
    {
      id: 2,
      name: "홍대 게임 카페",
      type: "대형 PC방",
      location: "서울 마포구",
      rooms: 80,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      service: "StreamPlayer + 노하드 시스템",
      beforeProblems: [
        "PC 하드웨어 잦은 고장으로 월 수리비 100만원",
        "각 PC별 OTT 로그인 관리의 어려움",
        "게임과 스트리밍 동시 사용 시 성능 저하"
      ],
      afterResults: {
        costSaving: "80%",
        satisfaction: "40%",
        problemReduction: "95%"
      },
      testimonial: "StreamPlayer와 노하드 시스템 도입으로 고객들이 게임과 스트리밍을 모두 즐기며 체류 시간이 늘어났어요. 수리비도 거의 없어지고 관리가 너무 편해졌습니다.",
      manager: "박게임 사장",
      period: "2023년 6월 도입"
    },
    {
      id: 3,
      name: "제주 부티크 호텔",
      type: "리조트 호텔",
      location: "제주도 서귀포시",
      rooms: 45,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      service: "넷플릭스 계정 대행",
      beforeProblems: [
        "45개 넷플릭스 계정 개별 관리의 어려움",
        "신용카드 및 이메일 관리 복잡성",
        "계정 오류 시 즉시 대응의 한계"
      ],
      afterResults: {
        costSaving: "70%",
        satisfaction: "90%",
        problemReduction: "100%"
      },
      testimonial: "넷플릭스 계정 대행 서비스로 복잡한 관리 업무에서 완전히 해방되었습니다. 고객 만족도도 크게 올라가고 운영진은 본업에만 집중할 수 있게 되었어요.",
      manager: "이리조트 지배인",
      period: "2023년 9월 도입"
    },
    {
      id: 4,
      name: "부산 비즈니스 호텔",
      type: "비즈니스 호텔",
      location: "부산 해운대구",
      rooms: 85,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      service: "OTT PLUS + 계정 대행",
      beforeProblems: [
        "해외 고객 대상 다국어 OTT 서비스 필요",
        "복잡한 리모컨 조작으로 인한 외국인 고객 불편",
        "다양한 OTT 구독료 부담"
      ],
      afterResults: {
        costSaving: "55%",
        satisfaction: "85%",
        problemReduction: "80%"
      },
      testimonial: "해외 고객들도 쉽게 사용할 수 있는 직관적인 인터페이스 덕분에 고객 만족도가 크게 향상되었습니다. 특히 일본, 중국 고객들의 재방문율이 높아졌어요.",
      manager: "최호텔 객실부장",
      period: "2023년 12월 도입"
    },
    {
      id: 5,
      name: "강남 e스포츠 카페",
      type: "프리미엄 PC방",
      location: "서울 강남구",
      rooms: 60,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      service: "노하드 시스템 + StreamPlayer",
      beforeProblems: [
        "e스포츠 대회 중 PC 다운으로 인한 경기 중단",
        "고성능 요구 게임과 스트리밍 동시 사용 문제",
        "시스템 관리에 너무 많은 시간 소요"
      ],
      afterResults: {
        costSaving: "75%",
        satisfaction: "50%",
        problemReduction: "98%"
      },
      testimonial: "노하드 시스템 도입 후 시스템 안정성이 획기적으로 개선되어 e스포츠 대회 운영이 매우 수월해졌습니다. 프로 게이머들도 시스템 성능에 만족하고 있어요.",
      manager: "정e스포츠 관장",
      period: "2024년 1월 도입"
    },
    {
      id: 6,
      name: "경기 패밀리 호텔",
      type: "패밀리 호텔",
      location: "경기도 수원시",
      rooms: 200,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      service: "통합 솔루션",
      beforeProblems: [
        "대규모 객실 운영으로 인한 관리 복잡성",
        "가족 단위 고객의 다양한 콘텐츠 요구",
        "높은 운영비용과 관리 인력 부족"
      ],
      afterResults: {
        costSaving: "60%",
        satisfaction: "92%",
        problemReduction: "85%"
      },
      testimonial: "200개 객실 관리가 이렇게 쉬워질 줄 몰랐습니다. 가족 고객들이 각자 원하는 콘텐츠를 편리하게 이용할 수 있어 만족도가 크게 향상되었어요.",
      manager: "한패밀리 총지배인",
      period: "2024년 2월 도입"
    }
  ];

  const stats = [
    {
      icon: <Building className="h-8 w-8" />,
      number: "1,500+",
      label: "고객사",
      description: "전국 숙박업소 및 PC방"
    },
    {
      icon: <Users className="h-8 w-8" />,
      number: "99.9%",
      label: "고객 만족도",
      description: "서비스 도입 후 평균 만족도"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      number: "68%",
      label: "평균 비용 절감",
      description: "기존 대비 운영비 절감 효과"
    },
    {
      icon: <Star className="h-8 w-8" />,
      number: "4.8/5",
      label: "서비스 평점",
      description: "고객 리뷰 평균 점수"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-success-stories-title">
            성공 사례
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            다양한 규모의 고객사에서 검증된 마루컴시스 솔루션의 성과를 확인하세요
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-detailed-stories-title">
              상세 성공 사례
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              실제 도입 고객사의 생생한 경험담과 구체적인 성과를 확인해보세요
            </p>
          </div>

          <div className="space-y-12">
            {successStories.map((story, index) => (
              <Card key={story.id} className="overflow-hidden shadow-lg bg-white border border-gray-200" data-testid={`story-${story.id}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white border-0">{story.service}</Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{story.name}</h3>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Building className="h-4 w-4 mr-2" />
                          <span>{story.type}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{story.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Monitor className="h-4 w-4 mr-2" />
                          <span>{story.rooms}개 {story.type.includes('PC') ? 'PC' : '객실'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{story.period}</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">도입 전 문제점</h4>
                      <ul className="space-y-2">
                        {story.beforeProblems.map((problem, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-600 text-sm">{problem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">도입 후 성과</h4>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{story.afterResults.costSaving}</div>
                          <div className="text-xs text-gray-500">비용 절감</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{story.afterResults.satisfaction}</div>
                          <div className="text-xs text-gray-500">만족도 향상</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{story.afterResults.problemReduction}</div>
                          <div className="text-xs text-gray-500">문제 해결</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4 mb-4 bg-blue-50 p-4 rounded-r-lg">
                      <p className="text-gray-800 italic mb-2">"{story.testimonial}"</p>
                      <div className="text-sm text-gray-600">- {story.manager}</div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-industries-title">
              서비스 제공 업종
            </h2>
            <p className="text-xl text-gray-600">
              다양한 업종에서 검증된 마루컴시스의 솔루션
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200" data-testid="industry-business-hotel">
              <CardContent className="pt-8">
                <div className="text-4xl mb-4">🏨</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">비즈니스 호텔</h3>
                <p className="text-sm text-gray-600">도심 중심가 비즈니스 고객 대상 호텔</p>
                <div className="mt-4 text-blue-600 font-semibold">450+ 고객사</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200" data-testid="industry-resort">
              <CardContent className="pt-8">
                <div className="text-4xl mb-4">🏖️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">리조트 호텔</h3>
                <p className="text-sm text-gray-600">휴양지 및 관광지 리조트 호텔</p>
                <div className="mt-4 text-blue-600 font-semibold">150+ 고객사</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200" data-testid="industry-pcroom">
              <CardContent className="pt-8">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PC방</h3>
                <p className="text-sm text-gray-600">일반 PC방 및 프리미엄 게임 카페</p>
                <div className="mt-4 text-blue-600 font-semibold">450+ 고객사</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200" data-testid="industry-motel">
              <CardContent className="pt-8">
                <div className="text-4xl mb-4">🏩</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">모텔 & 펜션</h3>
                <p className="text-sm text-gray-600">소규모 숙박업소 및 독립 펜션</p>
                <div className="mt-4 text-blue-600 font-semibold">450+ 고객사</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-title" style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.5), 1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            다음 성공 사례의 주인공이 되어보세요
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto" style={{
            textShadow: '1px 1px 3px rgba(0,0,0,0.4), 1px 1px 2px rgba(0,0,0,0.2)'
          }}>
            수많은 고객사가 경험한 혁신적인 변화를 
            귀하의 사업장에서도 경험해보세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" data-testid="button-contact-consultation">
                무료 상담 신청하기
              </Button>
            </Link>
            <Button size="lg" className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-blue-600" data-testid="button-demo-request" style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              데모 시연 요청하기
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
