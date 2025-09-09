import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold">ProTech</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              혁신적인 기술 솔루션으로 기업의 디지털 전환을 선도하는 글로벌 IT 기업입니다.
            </p>
            <div className="flex space-x-4">
              <button className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-colors" data-testid="footer-facebook">
                <Facebook size={20} />
              </button>
              <button className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-colors" data-testid="footer-twitter">
                <Twitter size={20} />
              </button>
              <button className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-colors" data-testid="footer-linkedin">
                <Linkedin size={20} />
              </button>
              <button className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-colors" data-testid="footer-instagram">
                <Instagram size={20} />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors text-left">클라우드 솔루션</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors text-left">앱 개발</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors text-left">AI/ML 솔루션</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors text-left">기술 컨설팅</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors text-left">맞춤형 솔루션</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">회사</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors text-left">회사소개</button></li>
              <li><button onClick={() => scrollToSection('team')} className="hover:text-white transition-colors text-left">팀</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors text-left">채용정보</button></li>
              <li><button className="hover:text-white transition-colors text-left">뉴스</button></li>
              <li><button className="hover:text-white transition-colors text-left">파트너십</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors text-left">문의하기</button></li>
              <li><button className="hover:text-white transition-colors text-left">기술지원</button></li>
              <li><button className="hover:text-white transition-colors text-left">문서</button></li>
              <li><button className="hover:text-white transition-colors text-left">FAQ</button></li>
              <li><button className="hover:text-white transition-colors text-left">커뮤니티</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ProTech Corporation. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">이용약관</button>
              <button className="hover:text-white transition-colors">개인정보처리방침</button>
              <button className="hover:text-white transition-colors">쿠키 정책</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
