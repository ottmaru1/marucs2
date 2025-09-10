import { useState } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PricingGuide from "@/components/cost-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tv, 
  Monitor, 
  Shield, 
  Server, 
  Wand2, 
  DollarSign, 
  Zap,
  CheckCircle,
  Award,
  Users,
  PhoneCall,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  Play,
  Building,
  Gamepad2,
  Wifi,
  Globe,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const handleServiceNavigation = (href: string) => {
    // 즉시 상단으로 스크롤
    window.scrollTo(0, 0);
    
    // 페이지 이동
    setLocation(href);
    
    // 페이지 이동 후 추가로 상단으로 스크롤 (보험용)
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }, 50);
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }, 200);
  };

  const successStories = [
    {
      name: "강남 프리미엄 호텔",
      description: "객실 120개 규모의 비즈니스 호텔",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      savings: "65%",
      satisfaction: "95%",
      testimonial: "OTT PLUS 도입 후 고객 불만이 90% 줄어들었고, 운영 효율성이 크게 향상되었습니다."
    },
    {
      name: "홍대 게임 카페",
      description: "PC 80대 규모의 대형 PC방",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      savings: "80%",
      satisfaction: "40%",
      testimonial: "StreamPlayer로 고객들이 게임과 스트리밍을 모두 즐기며 체류 시간이 늘어났어요."
    },
    {
      name: "제주 부티크 호텔",
      description: "객실 45개 규모의 리조트 호텔",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      savings: "70%",
      satisfaction: "90%",
      testimonial: "넷플릭스 계정 대행 서비스로 복잡한 관리 업무에서 완전히 해방되었습니다."
    }
  ];

  const ottServices = [
    { name: "Netflix", color: "bg-red-100 text-red-800" },
    { name: "Disney+", color: "bg-blue-100 text-blue-800" },
    { name: "TVING", color: "bg-purple-100 text-purple-800" },
    { name: "Wavve", color: "bg-green-100 text-green-800" },
    { name: "YouTube", color: "bg-yellow-100 text-yellow-800" },
    { name: "+ 더보기", color: "bg-gray-100 text-gray-800" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Netflix Interface with Multiple Shows Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/60"></div>
        </div>
        
        {/* Dynamic Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse opacity-70"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-pulse delay-1000 opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-spin-slow"></div>
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 text-white/90 text-sm font-medium mb-8 shadow-2xl">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                전국 1,000+ 고객사가 선택한 믿을 수 있는 파트너
                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight" data-testid="text-hero-title">
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-2xl">
                  OTT 통합 솔루션
                </span><br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  마루컴시스
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed font-light" data-testid="text-hero-subtitle">
                호텔·PC방 전용 OTT 서비스<br />
                <span className="text-cyan-300 font-medium">계정 관리부터 노하드 시스템까지</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
                <Link href="/contact">
                  <Button className="group relative px-12 py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 transform hover:scale-105" data-testid="button-solution-inquiry">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <PhoneCall className="h-6 w-6 mr-3 relative z-10" />
                    <span className="relative z-10">무료 상담 신청</span>
                    <ArrowRight className="h-5 w-5 ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="group px-12 py-5 text-xl font-semibold rounded-2xl bg-white/10 backdrop-blur-xl text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-500 shadow-xl" 
                  data-testid="button-services-overview"
                  onClick={scrollToServices}
                >
                  <Play className="h-5 w-5 mr-3" />
                  서비스 둘러보기
                </Button>
              </div>
              
              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  { value: "99.9%", label: "서비스 가동률", icon: <ShieldCheck className="h-8 w-8" />, color: "from-green-400 to-emerald-500" },
                  { value: "1,500+", label: "도입 업체", icon: <Users className="h-8 w-8" />, color: "from-blue-400 to-cyan-500" },
                  { value: "24/7", label: "기술 지원", icon: <Zap className="h-8 w-8" />, color: "from-yellow-400 to-orange-500" }
                ].map((stat, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 shadow-2xl">
                      <div className="flex items-center justify-center mb-4">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`}>
                          <div className="text-white">
                            {stat.icon}
                          </div>
                        </div>
                      </div>
                      <div className="text-5xl font-black text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-gray-300 font-medium text-lg">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gradient-surface relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Award className="h-4 w-4 mr-2" />
              20년 이상의 축적된 전문성
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6" data-testid="text-core-values-title">
              마루컴시스의 핵심 가치
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              검증된 기술력과 고객 중심의 서비스로 최고의 솔루션을 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Wand2 className="h-8 w-8" />,
                title: "혁신적 편리함",
                description: "클릭 한 번으로 모든 OTT 서비스에 접근하는 차세대 통합 솔루션",
                color: "bg-gradient-to-br from-primary/10 to-primary/5",
                iconColor: "text-primary",
                testId: "card-convenience"
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: "합리적 가격",
                description: "개별 구독 대비 최대 70% 비용 절감으로 경제적 운영 실현",
                color: "bg-gradient-to-br from-green-500/10 to-green-500/5",
                iconColor: "text-green-500",
                testId: "card-price"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "즉시 복구 지원",
                description: "장애 발생 시 5분 내 즉시 대응하는 24시간 전문 기술 지원",
                color: "bg-gradient-to-br from-accent/10 to-accent/5",
                iconColor: "text-accent",
                testId: "card-recovery"
              }
            ].map((value, index) => (
              <Card key={index} className="group hover:shadow-strong transition-all duration-500 cursor-pointer bg-gradient-card border-0 animate-slide-up" style={{ animationDelay: `${index * 150}ms` }} data-testid={value.testId}>
                <CardContent className="pt-8 text-center p-8">
                  <div className={`w-20 h-20 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                    <div className={value.iconColor}>
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1,500+", label: "도입 업체" },
              { value: "99.9%", label: "가동률" },
              { value: "5분", label: "평균 응답시간" },
              { value: "20년+", label: "운영 경험" }
            ].map((metric, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${500 + index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-muted-foreground font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1489599142428-3e77f9ee4c4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80" 
            alt="Streaming Content Grid Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/85"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/90"></div>
        </div>
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 text-sm font-medium mb-8">
              <Star className="h-4 w-4 mr-2" />
              프리미엄 솔루션
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8" data-testid="text-services-title">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                핵심 서비스
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              숙박업소를 위한 혁신적인 통합 엔터테인먼트 플랫폼
            </p>
            <div className="mt-8 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-cyan-300 font-semibold">✨ 국내 1위 OTT 통합 솔루션 제공업체</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: "OTT PLUS",
                description: "호텔 전용 셋톱박스 솔루션",
                icon: <Tv className="h-16 w-16" />,
                gradient: "from-blue-600 via-purple-600 to-red-600",
                bgImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                features: ["4K 스트리밍", "다국어 지원", "원격 관리", "맞춤 UI"],
                link: "/services/ott-plus",
                highlight: "호텔 특화",
                ottLogos: true
              },
              {
                title: "StreamPlayer",
                description: "PC 전용 스트리밍 프로그램",
                icon: <Monitor className="h-16 w-16" />,
                gradient: "from-cyan-400 to-blue-500",
                bgImage: "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                features: ["게임과 동시 실행", "최적화된 성능", "간편 설치", "자동 업데이트"],
                link: "/services/streamplayer",
                highlight: "PC 설치형"
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-3xl hover:transform hover:scale-105 transition-all duration-700 cursor-pointer"
                onClick={() => handleServiceNavigation(service.link)}
              >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={service.bgImage} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors duration-500"></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  </div>
                  
                  <div className="relative z-10 p-8 h-96 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-end mb-6">
                        <Badge className="bg-black/95 text-white border-white/80 backdrop-blur-sm font-bold" style={{
                          textShadow: '2px 2px 4px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,1)',
                          WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                        }}>
                          {service.highlight}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} shadow-lg mr-4 relative overflow-hidden`}>
                          <div className="text-white relative z-10">
                            {service.icon}
                          </div>
                          {service.ottLogos && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div className="bg-red-600 text-white px-1 py-0.5 rounded">N</div>
                                <div className="bg-blue-600 text-white px-1 py-0.5 rounded">D+</div>
                                <div className="bg-orange-500 text-white px-1 py-0.5 rounded">T</div>
                                <div className="bg-red-500 text-white px-1 py-0.5 rounded">Y</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300" style={{
                          textShadow: '3px 3px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)',
                          WebkitTextStroke: '1px rgba(0,0,0,0.3)'
                        }}>
                          {service.title}
                        </h3>
                      </div>
                      
                      <p className="text-white text-lg mb-4 font-semibold" style={{
                        textShadow: '2px 2px 4px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,1)',
                        WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                      }}>
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-white font-medium" style={{
                          textShadow: '2px 2px 4px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,1)',
                          WebkitTextStroke: '0.3px rgba(0,0,0,0.3)'
                        }}>
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,1))'}} />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/20 hover:from-white/20 hover:to-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm" data-testid={`button-learn-more-${index}`}>
                      자세히 보기
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-500"></div>
                </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "넷플릭스 계정",
                description: "프리미엄 계정 관리 서비스",
                icon: <Shield className="h-16 w-16" />,
                gradient: "from-red-600 via-rose-500 to-pink-600",
                bgImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                features: ["계정 관리", "보안 강화", "비용 절감", "24시간 지원"],
                link: "/services/netflix-account",
                highlight: "계정 대행",
                sparkle: true
              },
              {
                title: "노하드 시스템",
                description: "고성능 디스크리스 솔루션",
                icon: <Server className="h-16 w-16" />,
                gradient: "from-slate-600 to-blue-600",
                bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                features: ["디스크리스", "중앙 관리", "빠른 부팅", "유지보수 간편"],
                link: "/services/nohard-system",
                highlight: "숙박업소 특화"
              }
            ].map((service, index) => (
              <div 
                key={index + 2} 
                className="group relative overflow-hidden rounded-3xl hover:transform hover:scale-105 transition-all duration-700 cursor-pointer"
                onClick={() => handleServiceNavigation(service.link)}
              >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={service.bgImage} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors duration-500"></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  </div>
                  
                  <div className="relative z-10 p-8 h-96 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-end mb-6">
                        <Badge className="bg-black/95 text-white border-white/80 backdrop-blur-sm font-bold" style={{
                          textShadow: '2px 2px 4px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,1)',
                          WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                        }}>
                          {service.highlight}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} shadow-lg mr-4 relative overflow-hidden`}>
                          <div className="text-white relative z-10">
                            {service.icon}
                          </div>
                          {service.sparkle && (
                            <>
                              <div className="absolute -top-1 -right-1">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                                <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                              </div>
                              <div className="absolute -bottom-1 -left-1">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                              </div>
                              <div className="absolute top-1 left-1">
                                <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                              </div>
                            </>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300" style={{
                          textShadow: '3px 3px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1)',
                          WebkitTextStroke: '1px rgba(0,0,0,0.3)'
                        }}>
                          {service.title}
                        </h3>
                      </div>
                      
                      <p className="text-white mb-4 text-lg font-semibold" style={{
                        textShadow: '2px 2px 4px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,1)',
                        WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                      }}>
                        {service.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-white font-medium" style={{
                            textShadow: '2px 2px 4px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,1)',
                            WebkitTextStroke: '0.3px rgba(0,0,0,0.3)'
                          }}>
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,1))'}} />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/20 hover:from-white/20 hover:to-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm" data-testid={`button-learn-more-${index + 2}`}>
                      자세히 보기
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-500"></div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1,500+</div>
              <div className="text-blue-100">설치 완료</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">서비스 안정성</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">기술 지원</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">6개</div>
              <div className="text-blue-100">OTT 플랫폼</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section - Simple Design */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              성공 사례
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              전국 다양한 업체에서 검증받은 솔루션의 실사용 사례
            </p>
          </div>
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* OTT PLUS */}
            <Card className="bg-white hover:shadow-lg transition-shadow" data-testid="card-ott-plus-simple">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <Tv className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">OTT PLUS</h3>
                    <p className="text-sm text-blue-600">안드로이드 셋톱형</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  숙박업소에 최적화된 셋톱박스 솔루션
                </p>
                
                <div className="space-y-2 mb-4">
                  {[
                    "실시간 자동 업데이트",
                    "장애시 빠른 복구", 
                    "렌탈 및 판매 가능"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  data-testid="button-ott-plus-simple"
                  onClick={() => handleServiceNavigation("/services/ott-plus")}
                >
                  자세히 보기
                </Button>
              </CardContent>
            </Card>

            {/* StreamPlayer */}
            <Card className="bg-white hover:shadow-lg transition-shadow" data-testid="card-streamplayer-simple">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                    <Monitor className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">StreamPlayer</h3>
                    <p className="text-sm text-green-600">PC용 통합OTT</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  PC에 직접 설치하는 통합 프로그램
                </p>
                
                <div className="space-y-2 mb-4">
                  {[
                    "PC 설치형 프로그램",
                    "간편한 계정 관리",
                    "빠른 로딩 속도"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  data-testid="button-streamplayer-simple"
                  onClick={() => handleServiceNavigation("/services/streamplayer")}
                >
                  자세히 보기
                </Button>
              </CardContent>
            </Card>

            {/* Netflix Account */}
            <Card className="bg-white hover:shadow-lg transition-shadow" data-testid="card-netflix-simple">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">넷플릭스 계정</h3>
                    <p className="text-sm text-red-600">계정 공급 관리</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  당일 주문 당일 계정 공급
                </p>
                
                <div className="space-y-2 mb-4">
                  {[
                    "당일 계정 공급",
                    "전용 아이디 제공",
                    "성인인증 관리"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  data-testid="button-netflix-simple"
                  onClick={() => handleServiceNavigation("/services/netflix-account")}
                >
                  자세히 보기
                </Button>
              </CardContent>
            </Card>

            {/* NoHard System */}
            <Card className="bg-white hover:shadow-lg transition-shadow" data-testid="card-nohard-simple">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Server className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">노하드 시스템</h3>
                    <p className="text-sm text-purple-600">유지관리 걱정 NO</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  PC방 게임을 빠르게 실행
                </p>
                
                <div className="space-y-2 mb-4">
                  {[
                    "빠른 게임 실행",
                    "납품부터 설치까지",
                    "렌탈 서비스 가능"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  data-testid="button-nohard-simple"
                  onClick={() => handleServiceNavigation("/services/nohard-system")}
                >
                  자세히 보기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <PricingGuide />

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-success-stories-title">성공 사례</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              다양한 규모의 고객사에서 검증된 마루컴시스 솔루션의 성과를 확인하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow" data-testid={`card-success-story-${index}`}>
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{story.name}</h3>
                  <p className="text-gray-600 mb-4">{story.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">월 비용 절감</span>
                      <span className="text-sm font-semibold text-green-600">{story.savings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">고객 만족도</span>
                      <span className="text-sm font-semibold text-blue-600">{story.satisfaction}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "{story.testimonial}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              className="bg-primary hover:bg-primary-dark text-white" 
              data-testid="button-more-success-stories"
              onClick={() => handleServiceNavigation("/success-stories")}
            >
              더 많은 성공 사례 보기
            </Button>
          </div>
        </div>
      </section>

      {/* About Company */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-testid="section-about-content">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">회사 소개</h2>
              <h3 className="text-2xl font-semibold text-primary mb-4">
                20년 이상의 베테랑 숙박업 관련 서비스 업체가 만든 마루TV
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                마루컴시스는 오랜 경험과 전문성을 바탕으로 숙박업계와 PC방 업계의 니즈를 정확히 파악하고, 
                고객 맞춤형 솔루션을 제공하는 '솔루션 파트너'입니다.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Award className="text-primary text-xl mr-4" />
                  <span className="text-gray-700">20년 이상의 업계 경험과 노하우</span>
                </div>
                <div className="flex items-center">
                  <Users className="text-primary text-xl mr-4" />
                  <span className="text-gray-700">전국 1,000여 고객사 서비스 제공</span>
                </div>
                <div className="flex items-center">
                  <PhoneCall className="text-primary text-xl mr-4" />
                  <span className="text-gray-700">24시간 365일 기술 지원</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="text-primary text-xl mr-4" />
                  <span className="text-gray-700">안정적이고 신뢰할 수 있는 서비스</span>
                </div>
              </div>
              <Link href="/about">
                <Button className="bg-accent hover:bg-accent/90 text-white" data-testid="button-company-details">
                  회사 상세 정보 보기
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Professional business team"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
