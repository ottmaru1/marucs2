import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import RemoteSupportModal from "@/components/RemoteSupportModal";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [remoteSupportModalOpen, setRemoteSupportModalOpen] = useState(false);

  const scrollToServices = () => {
    if (location !== "/") {
      // 다른 페이지에서는 홈페이지로 이동 후 스크롤
      setLocation("/");
      // 페이지 변경 후 스크롤 실행
      setTimeout(() => {
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
          servicesSection.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    } else {
      // 홈페이지에서는 서비스 섹션으로 스크롤
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    }
  };

  // URL 해시가 #services인 경우 스크롤 처리
  useEffect(() => {
    if (location === "/" && window.location.hash === "#services") {
      setTimeout(() => {
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
          servicesSection.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    }
  }, [location]);

  const navigation = [
    { name: "홈", href: "/" },
    { name: "회사 소개", href: "/about" },
    { name: "주요 서비스", href: "#", onClick: scrollToServices },
    { name: "성공 사례", href: "/success-stories" },
    { name: "다운로드", href: "/downloads" },
    { name: "원격지원", href: "#", onClick: () => setRemoteSupportModalOpen(true) },
    { name: "관리자", href: "/admin" },
  ] as Array<{ name: string; href: string; onClick?: () => void }>;

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    if (href === "#" && location === "/") return false; // 주요 서비스는 홈에서 활성화하지 않음
    return location.startsWith(href);
  };

  return (
    <header className="bg-slate-900/95 border-b border-slate-800/50 backdrop-blur-xl sticky top-0 z-50 shadow-strong">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group" data-testid="link-home">
              <h1 className="text-2xl font-display font-bold text-white group-hover:text-blue-400 transition-all duration-300">
                마루컴시스
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navigation.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                    data-testid={`button-${item.name.toLowerCase().replace(" ", "-")}`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => window.scrollTo(0, 0)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActive(item.href)
                        ? "text-blue-400 bg-blue-500/10 shadow-lg"
                        : "text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                    }`}
                    data-testid={`link-${item.name.toLowerCase().replace(" ", "-")}`}
                  >
                    {item.name}
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                    )}
                  </Link>
                )
              ))}
              <Link href="/contact" onClick={() => window.scrollTo(0, 0)} data-testid="button-contact">
                <Button variant="outline" className="ml-4 px-6 py-2 rounded-xl font-medium border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                  문의하기
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 animate-fade-in">
            <div className="bg-slate-900/95 shadow-strong border-b border-slate-800/50 backdrop-blur-xl">
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navigation.map((item) => (
                  item.onClick ? (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.onClick!();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                      data-testid={`mobile-button-${item.name.toLowerCase().replace(" ", "-")}`}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                        isActive(item.href)
                          ? "text-blue-400 bg-blue-500/10 shadow-lg"
                          : "text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                      }`}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setMobileMenuOpen(false);
                      }}
                      data-testid={`mobile-link-${item.name.toLowerCase().replace(" ", "-")}`}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <Link href="/contact" onClick={() => {
                  window.scrollTo(0, 0);
                  setMobileMenuOpen(false);
                }} data-testid="mobile-button-contact">
                  <Button variant="outline" className="w-full mt-4 px-4 py-3 rounded-xl text-sm font-medium border-primary text-primary hover:bg-primary hover:text-white">
                    문의하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Remote Support Modal */}
      <RemoteSupportModal 
        open={remoteSupportModalOpen} 
        onOpenChange={setRemoteSupportModalOpen} 
      />
    </header>
  );
}
