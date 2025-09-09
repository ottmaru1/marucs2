import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, PhoneCall, ShieldCheck, Target, Eye, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="text-about-title">
            회사 소개
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            20년 이상의 베테랑 숙박업 관련 서비스 업체가 만든 마루TV
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-testid="section-company-overview">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">마루컴시스</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                신뢰할 수 있는 솔루션 파트너
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                마루컴시스는 오랜 경험과 전문성을 바탕으로 숙박업계와 PC방 업계의 니즈를 정확히 파악하고, 
                고객 맞춤형 솔루션을 제공하는 '솔루션 파트너'입니다.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                우리는 단순한 서비스 제공자가 아닌, 고객의 성공을 함께 만들어가는 파트너로서 
                최고의 기술력과 서비스로 고객의 비즈니스 성장에 기여하고 있습니다.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
                  <div className="text-gray-600">년 이상 경험</div>
                </div>
                <div className="text-center bg-green-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">1,000+</div>
                  <div className="text-gray-600">고객사</div>
                </div>
                <div className="text-center bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-gray-600">기술 지원</div>
                </div>
                <div className="text-center bg-orange-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                  <div className="text-gray-600">고객 만족도</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Professional business team"
                className="rounded-2xl shadow-xl w-full border border-gray-200"
                data-testid="img-company-team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-white border border-gray-200 shadow-lg" data-testid="card-vision">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">비전</h3>
                <p className="text-gray-600">
                  OTT 통합 솔루션의 선도 기업으로서 고객의 성공과 함께 성장하는 신뢰받는 파트너가 되겠습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-200 shadow-lg" data-testid="card-mission">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">미션</h3>
                <p className="text-gray-600">
                  혁신적인 기술과 최고 수준의 서비스로 고객의 비즈니스 가치를 극대화하고 새로운 기회를 창출합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-200 shadow-lg" data-testid="card-values">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">핵심 가치</h3>
                <p className="text-gray-600">
                  고객 중심, 혁신, 신뢰, 협력을 바탕으로 지속 가능한 가치를 창출하며 사회적 책임을 다합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Strengths */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-strengths-title">
              마루컴시스의 강점
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              오랜 경험과 전문성으로 차별화된 서비스를 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200" data-testid="card-experience">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">풍부한 경험</h3>
                <p className="text-gray-600 text-sm">
                  20년 이상의 업계 경험과 노하우로 검증된 솔루션을 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200" data-testid="card-customers">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">광범위한 고객층</h3>
                <p className="text-gray-600 text-sm">
                  전국 1,000여 고객사에 서비스를 제공하며 다양한 경험을 보유하고 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200" data-testid="card-support">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhoneCall className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">24시간 지원</h3>
                <p className="text-gray-600 text-sm">
                  365일 24시간 기술 지원으로 언제든지 안심하고 사용할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200" data-testid="card-reliability">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">신뢰성</h3>
                <p className="text-gray-600 text-sm">
                  안정적이고 신뢰할 수 있는 서비스로 고객의 비즈니스를 지원합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-history-title">
              회사 연혁
            </h2>
            <p className="text-xl text-gray-600">
              지속적인 혁신과 성장의 발자취
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-6" data-testid="timeline-2024">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold shadow-lg">
                2024
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">차세대 OTT 통합 플랫폼 출시</h3>
                <p className="text-gray-600">
                  AI 기반 콘텐츠 추천 시스템과 클라우드 기반 관리 솔루션을 도입하여 
                  고객 경험을 한층 업그레이드했습니다.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6" data-testid="timeline-2020">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold shadow-lg">
                2020
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">전국 서비스 확대</h3>
                <p className="text-gray-600">
                  PC방 및 숙박업소 대상 서비스를 전국으로 확대하며, 
                  고객사 1,000곳을 돌파했습니다.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6" data-testid="timeline-2015">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-bold shadow-lg">
                2015
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">OTT 통합 솔루션 개발</h3>
                <p className="text-gray-600">
                  업계 최초로 다중 OTT 플랫폼 통합 솔루션을 개발하여 
                  시장의 주목을 받았습니다.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6" data-testid="timeline-2004">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-800 font-bold shadow-lg">
                2004
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">마루컴시스 창립</h3>
                <p className="text-gray-600">
                  숙박업 및 PC방 업계 전문 서비스 회사로 출발하여 
                  고객 중심의 솔루션 개발을 시작했습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
