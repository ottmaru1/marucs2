import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Mail,
  Phone,
  FileText,
  Zap
} from "lucide-react";

export default function NetflixAccount() {
  const problems = [
    {
      icon: "💳",
      title: "다량의 신용카드 준비",
      description: "각 계정마다 별도의 신용카드가 필요해 카드 관리가 복잡합니다."
    },
    {
      icon: "📧",
      title: "이메일 생성 및 관리",
      description: "수십 개의 이메일 계정을 생성하고 관리해야 하는 번거로움이 있습니다."
    },
    {
      icon: "🔞",
      title: "성인 인증 절차",
      description: "각 계정마다 복잡한 성인 인증 절차를 거쳐야 합니다."
    },
    {
      icon: "📱",
      title: "핸드폰 등록 문제",
      description: "계정마다 전화번호 인증이 필요해 관리가 어렵습니다."
    }
  ];

  const solutions = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "당일 주문 당일 계정 공급",
      description: "주문 즉시 검증된 넷플릭스 계정을 당일 내로 공급해드립니다."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "숙박업소 전용 아이디 제공",
      description: "숙박업소 환경에 최적화된 전용 계정으로 안정적인 서비스를 보장합니다."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "성인인증 관리 대행",
      description: "복잡한 성인인증 절차를 당사에서 대신 처리해드립니다."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "세금계산서 발행",
      description: "정식 세금계산서 발행으로 부가세 절감 및 비용 처리가 가능합니다."
    }
  ];

  const benefits = [
    {
      title: "NO 약정 NO 의무기간",
      description: "부담 없이 사용하고 언제든지 해지 가능",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "부가세 절감",
      description: "세금계산서를 통한 정식 비용 처리",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "전문 계정 관리",
      description: "숙박업 전문 팀의 체계적인 계정 관리",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-pink-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-netflix-title">
              넷플릭스 계정 대행
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
              장애 없는 넷플릭스 계정 공급 서비스
            </p>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              효율적인 넷플릭스 계정 공급 관리로 복잡한 업무를 해결하세요
            </p>
          </div>
        </div>
      </section>

      {/* Problem Recognition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-problem-title">
              숙박업주가 겪는 넷플릭스 계정 관리의 어려움
            </h2>
            <p className="text-lg text-gray-700">이런 복잡한 과정들 때문에 고민하고 계시지 않나요?</p>
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

      {/* Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Business meeting technology"
                className="rounded-2xl shadow-lg w-full"
                data-testid="img-netflix-solution"
              />
            </div>
            <div data-testid="section-solution">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">마루컴시스 솔루션</h2>
              <h3 className="text-2xl font-semibold text-red-600 mb-6">
                "신경 쓸 필요 없이 당사에서 한번에 효율적으로 공급해 드립니다"
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                복잡한 넷플릭스 계정 생성부터 관리까지 모든 과정을 전문적으로 대행하여 
                숙박업소 운영에만 집중할 수 있도록 도와드립니다.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">전문 팀의 체계적인 계정 관리</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">신용카드 및 이메일 관리 대행</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">24시간 계정 모니터링</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">장애 발생 시 즉시 대체 계정 제공</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-features-title">
              차별화된 서비스
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              마루컴시스만의 전문적인 넷플릭스 계정 대행 서비스
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-solution-${index}`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-red-600 bg-opacity-10 rounded-full flex items-center justify-center text-red-600">
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

      {/* Additional Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-benefits-title">
              부가 가치
            </h2>
            <p className="text-xl text-gray-600">
              계정 대행 서비스와 함께 제공되는 추가 혜택
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className={`text-center ${benefit.color} border-2`} data-testid={`card-benefit-${index}`}>
                <CardContent className="pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-process-title">
              서비스 진행 과정
            </h2>
            <p className="text-xl text-gray-600">
              간단한 4단계로 완료되는 넷플릭스 계정 대행 서비스
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="step-1">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">문의 및 상담</h3>
              <p className="text-gray-600 text-sm">필요한 계정 수량과 요구사항을 상담합니다</p>
            </div>

            <div className="text-center" data-testid="step-2">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">계약 및 결제</h3>
              <p className="text-gray-600 text-sm">서비스 계약을 체결하고 결제를 진행합니다</p>
            </div>

            <div className="text-center" data-testid="step-3">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">계정 생성 및 설정</h3>
              <p className="text-gray-600 text-sm">전문팀이 계정을 생성하고 최적화 설정을 완료합니다</p>
            </div>

            <div className="text-center" data-testid="step-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">계정 전달 및 지원</h3>
              <p className="text-gray-600 text-sm">당일 내로 계정을 전달하고 지속적인 관리를 시작합니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-title">
            지금 바로 넷플릭스 계정 대행 서비스를 신청하세요
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            복잡한 계정 관리는 전문가에게 맡기고,
            숙박업소 본연의 서비스에만 집중하세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100" data-testid="button-contact-now">
                지금 바로 문의하기
              </Button>
            </Link>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 hover:text-red-700" data-testid="button-consultation">
              무료 상담 받기
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
