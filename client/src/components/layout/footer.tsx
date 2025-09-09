import { Link } from "wouter";
import { Facebook, Youtube, Instagram } from "lucide-react";
import PrivacyPolicyDialog from "@/components/legal/privacy-policy-dialog";
import TermsOfServiceDialog from "@/components/legal/terms-of-service-dialog";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">마루컴시스</h3>
            <p className="text-gray-300 mb-4">
              세상의 모든 OTT를 편하게 볼 수 있는 마루 TV<br />
              숙박업소와 PC방을 위한 전문 솔루션 제공
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/ott-plus"
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="link-ott-plus"
                >
                  OTT PLUS
                </Link>
              </li>
              <li>
                <Link
                  href="/services/streamplayer"
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="link-streamplayer"
                >
                  StreamPlayer
                </Link>
              </li>
              <li>
                <Link
                  href="/services/netflix-account"
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="link-netflix-account"
                >
                  넷플릭스 계정 대행
                </Link>
              </li>
              <li>
                <Link
                  href="/services/nohard-system"
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="link-nohard-system"
                >
                  노하드 시스템
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">고객 지원</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="link-faq"
                >
                  FAQ
                </a>
              </li>
              <li>
                <Link
                  href="/downloads"
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="link-downloads"
                >
                  다운로드
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="link-tech-support"
                >
                  기술 지원
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                  data-testid="link-contact"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="text-gray-300 text-sm">
              <div className="mb-2">
                회사명 : 마루컴시스 | 대표 : 은정웅 | 사업자번호 : 605-46-97405
              </div>
              <div className="mb-2">
                주소 : 경기도 군포시 번영로28번길 45-36 | 고객센터 : 070-8080-0953
              </div>
              <div>
                © 2024 마루컴시스. All rights reserved.
              </div>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <PrivacyPolicyDialog>
                <button
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                  data-testid="button-privacy-policy"
                >
                  개인정보처리방침
                </button>
              </PrivacyPolicyDialog>
              <TermsOfServiceDialog>
                <button
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                  data-testid="button-terms"
                >
                  이용약관
                </button>
              </TermsOfServiceDialog>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
