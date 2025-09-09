import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-2xl font-bold text-brand-blue cursor-pointer">ProTech</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-slate-600 hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-home"
              >
                홈
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-slate-600 hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-about"
              >
                회사소개
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-slate-600 hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-services"
              >
                서비스
              </button>
              <button 
                onClick={() => scrollToSection('team')} 
                className="text-slate-600 hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-team"
              >
                팀
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                data-testid="nav-contact"
              >
                문의하기
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-brand-blue"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => scrollToSection('home')} 
              className="block text-slate-600 hover:text-brand-blue px-3 py-2 text-base font-medium w-full text-left"
              data-testid="mobile-nav-home"
            >
              홈
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="block text-slate-600 hover:text-brand-blue px-3 py-2 text-base font-medium w-full text-left"
              data-testid="mobile-nav-about"
            >
              회사소개
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="block text-slate-600 hover:text-brand-blue px-3 py-2 text-base font-medium w-full text-left"
              data-testid="mobile-nav-services"
            >
              서비스
            </button>
            <button 
              onClick={() => scrollToSection('team')} 
              className="block text-slate-600 hover:text-brand-blue px-3 py-2 text-base font-medium w-full text-left"
              data-testid="mobile-nav-team"
            >
              팀
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="block bg-brand-blue text-white px-3 py-2 text-base font-medium rounded-md mx-3"
              data-testid="mobile-nav-contact"
            >
              문의하기
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
