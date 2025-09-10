import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Tv, 
  CheckCircle, 
  RefreshCw, 
  Zap, 
  Settings,
  Wifi,
  Shield,
  Clock
} from "lucide-react";
import watchaLogo from "@assets/WATCHA_Logo_Main_1754543558673.png";
import disneyLogo from "@assets/Disney+_logo.svg_1754543152100.png";
import netflixLogo from "@assets/Netflix_Logo_RGB_1754544148734.png";
import tvingLogo from "@assets/enm_media_220220714_01_1754544392930.jpg";
import nsmtvHomeImg from "@assets/nsmtv_홈화면_1754540059522.png";

export default function OttPlus() {
  const ottServices = [
    { 
      name: "Netflix",
      logo: (
        <div className="h-16 w-20 flex items-center justify-center">
          <img
            src={netflixLogo}
            alt="Netflix"
            className="h-16 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "Disney+",
      logo: (
        <div className="h-16 w-20 flex items-center justify-center">
          <img
            src={disneyLogo}
            alt="Disney+"
            className="h-16 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "TVING",
      logo: (
        <div className="h-16 w-20 flex items-center justify-center">
          <img
            src={tvingLogo}
            alt="TVING"
            className="h-16 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "왓챠",
      logo: (
        <div className="h-16 w-20 flex items-center justify-center">
          <img
            src={watchaLogo}
            alt="WATCHA"
            className="h-16 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "YouTube",
      logo: (
        <div className="h-16 w-20 flex items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/20/YouTube_2024.svg"
            alt="YouTube"
            className="h-16 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "Apple TV+",
      logo: (
        <div className="h-16 w-20 flex items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg"
            alt="Apple TV+"
            className="h-16 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    }
  ];

  const features = [
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: "실시간 자동 업데이트",
      description: "별도의 작업 없이 자동으로 최신 버전으로 업데이트되어 항상 최적의 성능을 유지합니다."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "장애시 빠른 복구",
      description: "시스템 장애 발생 시 즉시 감지하고 자동 복구 또는 원격 지원을 통해 빠른 해결을 제공합니다."
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "최적화된 프로그램",
      description: "숙박업소 환경에 특화된 UI/UX로 직관적이고 편리한 사용자 경험을 제공합니다."
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "네트워크 최적화",
      description: "안정적인 스트리밍을 위한 네트워크 최적화 기술로 끊김 없는 서비스를 보장합니다."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tv className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-ott-plus-title">
              OTT PLUS
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
              숙박업소에 최적화된 OTT 셋톱박스 솔루션
            </p>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              모든 OTT가 한곳에, 클릭 한 번으로 간편하게
            </p>
          </div>
        </div>
      </section>

      {/* Problem Recognition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-problem-title">
              숙박업소 운영자의 고민
            </h2>
            <p className="text-lg text-gray-700">이런 문제들로 고민하고 계시지 않나요?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow" data-testid="card-problem-1">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">😰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">복잡한 리모컨 관리</h3>
                <p className="text-gray-700 text-sm">
                  KT, LG, 각종 OTT 박스 리모컨들이 너무 많아 고객들이 혼란스러워합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow" data-testid="card-problem-2">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">💸</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">높은 유지비용</h3>
                <p className="text-gray-700 text-sm">
                  각각의 OTT 서비스 구독료와 장비 관리비용이 계속 증가하고 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow" data-testid="card-problem-3">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">잦은 장애 발생</h3>
                <p className="text-gray-700 text-sm">
                  업데이트 오류, 계정 문제 등으로 고객 불만이 증가하고 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-testid="section-solution">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">OTT PLUS 솔루션</h2>
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">
                "모든 OTT가 한곳에"
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                OTT PLUS 셋톱박스 하나로 넷플릭스, 디즈니+ 등 다양한 OTT 서비스를 
                간편하게 이용할 수 있습니다. 복잡한 리모컨과 여러 기기는 이제 그만!
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">하나의 리모컨으로 모든 OTT 서비스 제어</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />  
                  <span className="text-gray-700">렌탈 및 판매 옵션 제공</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">숙박업소 전용 맞춤 설정</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">24시간 원격 관리 및 지원</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <span className="text-sm text-gray-700 font-medium">지원하는 OTT 서비스:</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                  {ottServices.map((service, index) => (
                    <div key={index} className="flex justify-center">
                      {service.logo}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <img
                src={nsmtvHomeImg}
                alt="OTT PLUS 홈화면 - 넷플릭스, 디즈니+, 티빙, 왓챠, 유튜브 등 다양한 OTT 서비스"
                className="rounded-2xl shadow-lg w-full"
                data-testid="img-ott-plus-demo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-features-title">
              핵심 기능
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              숙박업소 운영에 최적화된 강력한 기능들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow" data-testid={`card-feature-${index}`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-700">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-pricing-title">
              서비스 옵션
            </h2>
            <p className="text-xl text-gray-700">
              고객사의 상황에 맞는 다양한 옵션을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white border-2 border-blue-600 shadow-lg" data-testid="card-rental">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">렌탈 서비스</h3>
                <p className="text-gray-700 mb-6">
                  초기 비용 부담 없이 월 렌탈료로 시작하세요
                </p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">낮은 초기 투자 비용</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">무료 설치 및 설정</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">무료 A/S 및 교체 서비스</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">업그레이드 지원</span>
                  </li>
                </ul>
                <div className="text-3xl font-bold text-blue-600 mb-2">문의</div>
                <div className="text-gray-600 text-sm">객실 수에 따른 맞춤 견적</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-lg" data-testid="card-purchase">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">구매 서비스</h3>
                <p className="text-gray-700 mb-6">
                  한 번의 구매로 영구 사용하세요
                </p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">영구 사용 가능</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">1년 무상 A/S</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">소프트웨어 업데이트</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">기술 지원</span>
                  </li>
                </ul>
                <div className="text-3xl font-bold text-green-600 mb-2">문의</div>
                <div className="text-gray-500 text-sm">대량 구매 할인 적용</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-title">
            지금 바로 OTT PLUS를 도입하세요
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            복잡한 OTT 관리는 이제 그만! 
            하나의 솔루션으로 모든 고민을 해결하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" data-testid="button-contact-now">
                지금 바로 문의하기
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white hover:text-blue-600" data-testid="button-demo-request">
              데모 요청하기
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
