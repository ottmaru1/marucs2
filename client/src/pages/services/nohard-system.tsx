import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Server, 
  CheckCircle, 
  Zap, 
  Monitor,
  Settings,
  Wrench,
  Clock,
  Shield
} from "lucide-react";

export default function NoHardSystem() {
  const problems = [
    {
      icon: "🔧",
      title: "잦은 PC 고장",
      description: "하드웨어 문제로 인한 PC 다운타임이 수익에 직접적인 영향을 미칩니다."
    },
    {
      icon: "⬆️",
      title: "복잡한 업데이트",
      description: "각 PC마다 개별적으로 게임 및 시스템 업데이트를 관리해야 합니다."
    },
    {
      icon: "💻",
      title: "불안정한 시스템",
      description: "바이러스, 악성코드로 인한 시스템 불안정성이 지속적으로 발생합니다."
    },
    {
      icon: "⏱️",
      title: "긴 부팅 시간",
      description: "하드디스크 노후화로 인한 느린 부팅 및 게임 실행 속도 저하가 문제입니다."
    }
  ];

  const solutions = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "언제나 빠른 게임 실행",
      description: "SSD 기반 노하드 시스템으로 부팅부터 게임 실행까지 초고속 처리가 가능합니다."
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "PC 납품부터 설치까지",
      description: "하드웨어 선택부터 설치, 설정까지 원스톱 토탈 솔루션을 제공합니다."
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "렌탈 서비스 가능",
      description: "초기 투자 부담을 줄이는 렌탈 옵션으로 부담 없이 시작할 수 있습니다."
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "AS 항시대기, 빠른 응대",
      description: "24시간 기술 지원팀이 원격 및 현장 지원으로 신속하게 문제를 해결합니다."
    }
  ];

  const systemFeatures = [
    {
      title: "중앙 집중식 관리",
      description: "모든 PC를 한 곳에서 통합 관리하여 운영 효율성을 극대화합니다.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "무중단 서비스",
      description: "하드웨어 장애 시에도 서비스 중단 없이 즉시 대체 시스템으로 전환됩니다.",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "자동 백업 및 복구",
      description: "데이터 손실 걱정 없는 자동 백업과 원클릭 시스템 복구 기능을 제공합니다.",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Server className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-nohard-title">
              노하드 시스템
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
              PC방 게임을 언제나 빠르게 실행 / 유지관리 걱정 NO
            </p>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              차세대 무디스크 시스템으로 PC방 운영의 패러다임을 바꿔보세요
            </p>
          </div>
        </div>
      </section>

      {/* Problem Recognition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-problem-title">
              PC방 PC의 고질적인 문제들
            </h2>
            <p className="text-lg text-gray-700">이런 문제들로 매일 스트레스받고 계시지 않나요?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <Card key={index} className="text-center border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow" data-testid={`card-problem-${index}`}>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-gray-700 text-sm">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* System Explanation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-testid="section-system-explanation">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">노하드 시스템이란?</h2>
              <h3 className="text-2xl font-semibold text-purple-600 mb-6">
                "하드디스크 없이 네트워크로 부팅하는 혁신적인 시스템"
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                노하드 시스템은 각 PC에 하드디스크 없이 중앙 서버에서 
                네트워크를 통해 운영체제와 게임을 제공하는 시스템입니다. 
                이를 통해 관리 효율성과 시스템 안정성을 동시에 확보할 수 있습니다.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">하드디스크 고장 걱정 완전 해결</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">바이러스 및 악성코드 차단</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">초고속 부팅 및 게임 실행</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">중앙 집중식 관리로 운영 효율화</span>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Modern PC gaming setup"
                className="rounded-2xl shadow-lg w-full"
                data-testid="img-nohard-system"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-features-title">
              핵심 기능
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PC방 운영을 혁신적으로 바꾸는 노하드 시스템의 강력한 기능들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-solution-${index}`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-purple-600 bg-opacity-10 rounded-full flex items-center justify-center text-purple-600">
                      {solution.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{solution.title}</h3>
                      <p className="text-gray-600">{solution.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-system-features-title">
              시스템 특징
            </h2>
            <p className="text-xl text-gray-600">
              안정성과 효율성을 모두 갖춘 차세대 PC방 솔루션
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {systemFeatures.map((feature, index) => (
              <Card key={index} className={`text-center ${feature.color} border-2`} data-testid={`card-system-feature-${index}`}>
                <CardContent className="pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Scope */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-service-scope-title">
              서비스 범위
            </h2>
            <p className="text-xl text-gray-600">
              하드웨어부터 소프트웨어까지 토탈 솔루션 제공
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center" data-testid="card-hardware">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">하드웨어 솔루션</h3>
                <ul className="space-y-2 text-sm text-gray-600 text-left">
                  <li>• 고성능 서버 및 네트워크 장비</li>
                  <li>• 클라이언트 PC 최적화 구성</li>
                  <li>• 안정적인 네트워크 인프라</li>
                  <li>• 백업 및 이중화 시스템</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center" data-testid="card-software">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-green-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">소프트웨어 솔루션</h3>
                <ul className="space-y-2 text-sm text-gray-600 text-left">
                  <li>• 운영체제 및 드라이버 최적화</li>
                  <li>• 게임 자동 업데이트 시스템</li>
                  <li>• 중앙 관리 소프트웨어</li>
                  <li>• 보안 및 모니터링 솔루션</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center" data-testid="card-support">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-purple-600 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">지원 서비스</h3>
                <ul className="space-y-2 text-sm text-gray-600 text-left">
                  <li>• 24시간 기술 지원</li>
                  <li>• 정기 점검 및 유지보수</li>
                  <li>• 원격 모니터링 서비스</li>
                  <li>• 교육 및 컨설팅</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-benefits-title">
              도입 효과
            </h2>
            <p className="text-xl text-gray-600">
              노하드 시스템 도입으로 얻을 수 있는 실질적인 혜택
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center" data-testid="benefit-cost">
              <div className="text-4xl font-bold text-green-600 mb-2">60%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">운영비 절감</div>
              <div className="text-sm text-gray-600">하드웨어 교체 및 수리 비용 대폭 감소</div>
            </div>

            <div className="text-center" data-testid="benefit-time">
              <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">관리 시간 단축</div>
              <div className="text-sm text-gray-600">중앙 집중식 관리로 운영 효율성 극대화</div>
            </div>

            <div className="text-center" data-testid="benefit-stability">
              <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">시스템 안정성</div>
              <div className="text-sm text-gray-600">하드웨어 장애 및 바이러스 감염 방지</div>
            </div>

            <div className="text-center" data-testid="benefit-speed">
              <div className="text-4xl font-bold text-accent mb-2">3x</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">부팅 속도 향상</div>
              <div className="text-sm text-gray-600">SSD 기반 고속 부팅으로 대기시간 최소화</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-title">
            지금 바로 노하드 시스템을 도입하세요
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            PC방 운영의 혁신을 경험하고,
            고객 만족도 향상과 운영 효율성을 동시에 달성하세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" data-testid="button-contact-now">
                지금 바로 문의하기
              </Button>
            </Link>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700" data-testid="button-demo-request">
              시연 요청하기
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
