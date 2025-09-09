import { Cloud, Smartphone, Brain, MessageCircle, Check } from "lucide-react";

export function ServicesSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">서비스</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            다양한 산업 분야의 고객들에게 최적화된 기술 솔루션을 제공합니다.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 group">
            <div className="bg-brand-blue p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cloud className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">클라우드 솔루션</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              AWS, Azure, GCP를 활용한 클라우드 마이그레이션 및 인프라 최적화 서비스를 제공합니다.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center">
                <Check className="text-brand-blue mr-2" size={16} />
                클라우드 아키텍처 설계
              </li>
              <li className="flex items-center">
                <Check className="text-brand-blue mr-2" size={16} />
                데이터 마이그레이션
              </li>
              <li className="flex items-center">
                <Check className="text-brand-blue mr-2" size={16} />
                보안 및 모니터링
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl border border-sky-100 hover:shadow-xl transition-all duration-300 group">
            <div className="bg-brand-sky p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">앱 개발</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              iOS, Android 네이티브 앱부터 크로스플랫폼 앱까지 전문적인 모바일 솔루션을 개발합니다.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center">
                <Check className="text-brand-sky mr-2" size={16} />
                네이티브 앱 개발
              </li>
              <li className="flex items-center">
                <Check className="text-brand-sky mr-2" size={16} />
                크로스플랫폼 개발
              </li>
              <li className="flex items-center">
                <Check className="text-brand-sky mr-2" size={16} />
                UI/UX 디자인
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 group">
            <div className="bg-purple-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">AI/ML 솔루션</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              머신러닝과 인공지능 기술을 활용한 지능형 비즈니스 솔루션을 구축합니다.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center">
                <Check className="text-purple-600 mr-2" size={16} />
                데이터 분석 및 예측
              </li>
              <li className="flex items-center">
                <Check className="text-purple-600 mr-2" size={16} />
                자연어 처리
              </li>
              <li className="flex items-center">
                <Check className="text-purple-600 mr-2" size={16} />
                컴퓨터 비전
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-brand-blue to-brand-sky rounded-3xl p-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">맞춤형 솔루션이 필요하신가요?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              고객의 특별한 요구사항에 맞는 전용 솔루션을 설계하고 개발해 드립니다.
            </p>
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-white text-brand-blue px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all inline-flex items-center"
              data-testid="button-custom-solution"
            >
              <MessageCircle className="mr-2" size={20} />
              전문가와 상담하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
