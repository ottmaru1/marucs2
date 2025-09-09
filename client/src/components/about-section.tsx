import { TrendingUp, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">회사 소개</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            2010년 설립된 프로테크 코퍼레이션은 혁신적인 기술 솔루션을 통해 
            기업의 디지털 전환을 선도하는 글로벌 IT 기업입니다.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80" 
              alt="Professional team meeting" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
          
          <div className="order-1 md:order-2 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-brand-blue p-3 rounded-lg mr-4">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">비전</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                기술 혁신을 통해 모든 기업이 디지털 시대에서 성공할 수 있도록 돕는 것이 우리의 비전입니다.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-brand-sky p-3 rounded-lg mr-4">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">미션</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                고객 중심의 혁신적인 솔루션을 개발하여 비즈니스 가치를 창출하고 지속가능한 성장을 지원합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-brand-blue mb-2" data-testid="stat-years">13+</div>
                <div className="text-sm text-slate-600">운영 연수</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-brand-blue mb-2" data-testid="stat-projects">500+</div>
                <div className="text-sm text-slate-600">완료 프로젝트</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-brand-blue mb-2" data-testid="stat-clients">200+</div>
                <div className="text-sm text-slate-600">고객사</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
