import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Monitor, 
  CheckCircle, 
  RefreshCw, 
  Zap, 
  Settings,
  Download,
  Users,
  Gamepad2
} from "lucide-react";

// Import OTT service logos
import netflixLogo from "@assets/Netflix_Logo_RGB_1754544148734.png";
import disneyLogo from "@assets/Disney+_logo.svg_1754543152100.png";
import watchaLogo from "@assets/WATCHA_Logo_Main_1754543558673.png";
import tvingLogo from "@assets/enm_media_220220714_01_1754544392930.jpg";

export default function StreamPlayer() {
  const ottServices = [
    { 
      name: "Netflix",
      logo: (
        <div className="h-12 w-16 flex items-center justify-center">
          <img
            src={netflixLogo}
            alt="Netflix"
            className="h-12 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "Disney+",
      logo: (
        <div className="h-12 w-16 flex items-center justify-center">
          <img
            src={disneyLogo}
            alt="Disney+"
            className="h-12 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "TVING",
      logo: (
        <div className="h-12 w-16 flex items-center justify-center">
          <img
            src={tvingLogo}
            alt="TVING"
            className="h-12 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "왓챠",
      logo: (
        <div className="h-12 w-16 flex items-center justify-center">
          <img
            src={watchaLogo}
            alt="WATCHA"
            className="h-12 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "YouTube",
      logo: (
        <div className="h-12 w-16 flex items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/20/YouTube_2024.svg"
            alt="YouTube"
            className="h-12 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    },
    { 
      name: "Apple TV+",
      logo: (
        <div className="h-12 w-16 flex items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg"
            alt="Apple TV+"
            className="h-12 w-auto object-contain scale-125"
            style={{ objectPosition: 'center' }}
          />
        </div>
      )
    }
  ];

  const features = [
    {
      icon: <Settings className="h-8 w-8" />,
      title: "PC방 전용 최적화",
      description: "PC방 환경에 특화된 UI/UX와 네트워크 최적화로 최고의 성능을 제공합니다."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "간편한 계정 관리",
      description: "여러 계정을 통합 관리하고, 사용자별 프로필 설정으로 개인화된 서비스를 제공합니다."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "빠른 로딩 속도",
      description: "캐싱 기술과 네트워크 최적화로 콘텐츠 로딩 시간을 최소화합니다."
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: "무료 업데이트",
      description: "새로운 OTT 서비스 추가 및 기능 개선 사항을 무료로 업데이트합니다."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Monitor className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-streamplayer-title">
              StreamPlayer
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
              PC방에 최적화된 StreamPlayer 통합 프로그램
            </p>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              클릭 한 번으로 모든 OTT를 이용하는 스마트한 솔루션
            </p>
          </div>
        </div>
      </section>

      {/* Problem Recognition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-problem-title">
              PC방 운영자의 고민
            </h2>
            <p className="text-lg text-gray-700">PC방에서 OTT 서비스 이용 시 발생하는 문제들</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow" data-testid="card-problem-1">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">복잡한 로그인 관리</h3>
                <p className="text-gray-700 text-sm">
                  각 PC마다 여러 OTT 서비스에 개별 로그인해야 하는 번거로움
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow" data-testid="card-problem-2">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">시간 낭비</h3>
                <p className="text-gray-700 text-sm">
                  고객들이 원하는 콘텐츠를 찾기 위해 여러 앱을 전환하는 시간 소요
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow" data-testid="card-problem-3">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PC 성능 저하</h3>
                <p className="text-gray-700 text-sm">
                  여러 OTT 앱 동시 실행으로 인한 시스템 리소스 점유 및 성능 저하
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">StreamPlayer 솔루션</h2>
              <h3 className="text-2xl font-semibold text-green-600 mb-6">
                "클릭 한 번으로 모든 OTT를"
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                PC방에 설치된 컴퓨터를 기반으로 하는 PC형 OTT 서비스로, 
                하나의 프로그램에서 모든 OTT 플랫폼에 접근할 수 있습니다.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">하나의 프로그램으로 모든 OTT 서비스 이용</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">통합 검색 기능으로 원하는 콘텐츠 빠르게 찾기</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">게임과 동시 실행 최적화</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">중앙 집중식 계정 관리</span>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-sm text-gray-700 mb-4 block font-medium">지원하는 OTT 서비스:</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {ottServices.map((service, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        {service.logo}
                      </div>
                      <span className="text-xs text-gray-600 text-center">{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="PC cafe with StreamPlayer"
                className="rounded-2xl shadow-lg w-full"
                data-testid="img-streamplayer-demo"
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PC방 운영에 최적화된 강력한 기능들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-feature-${index}`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center text-green-600">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gaming Integration */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Gaming and streaming setup"
                className="rounded-2xl shadow-lg w-full"
                data-testid="img-gaming-integration"
              />
            </div>
            <div data-testid="section-gaming-integration">
              <div className="w-16 h-16 bg-purple-600 bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <Gamepad2 className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">게임과 스트리밍의 완벽한 조화</h2>
              <p className="text-lg text-gray-700 mb-6">
                StreamPlayer는 게임 실행에 영향을 주지 않도록 최적화되어 있어, 
                고객들이 게임을 즐기면서 동시에 스트리밍 콘텐츠도 시청할 수 있습니다.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">게임 성능에 영향 없는 백그라운드 실행</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">듀얼 모니터 지원으로 게임과 동시 시청</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">스마트 리소스 관리로 시스템 안정성 확보</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">게임 중 간편한 볼륨 및 화면 제어</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation & Support */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-support-title">
              설치 및 지원 서비스
            </h2>
            <p className="text-xl text-gray-600">
              설치부터 운영까지 완벽한 지원을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center" data-testid="card-installation">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">간편한 설치</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 원클릭 설치 프로그램</li>
                  <li>• 자동 환경 설정</li>
                  <li>• 기존 시스템과 호환</li>
                  <li>• 원격 설치 지원</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center" data-testid="card-management">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">중앙 관리</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 모든 PC 통합 관리</li>
                  <li>• 원격 모니터링</li>
                  <li>• 사용량 통계 제공</li>
                  <li>• 계정 일괄 관리</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center" data-testid="card-support">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-purple-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">24시간 지원</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 전화 및 원격 지원</li>
                  <li>• 실시간 장애 대응</li>
                  <li>• 정기 업데이트</li>
                  <li>• 교육 및 컨설팅</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-title">
            지금 바로 StreamPlayer를 도입하세요
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            PC방 고객들에게 최고의 엔터테인먼트 경험을 제공하고,
            매출 증대와 고객 만족도 향상을 동시에 달성하세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" data-testid="button-contact-now">
                지금 바로 문의하기
              </Button>
            </Link>
            <Link href="/downloads" onClick={() => window.scrollTo(0, 0)}>
              <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white hover:text-green-600" data-testid="button-download-now">
                프로그램 다운로드
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
