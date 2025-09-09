import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    document.title = "개인정보처리방침 - 마루컴시스";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. 개인정보의 처리 목적</h2>
              <p>마루컴시스(이하 '회사')는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>서비스 제공 및 계약 이행</li>
                <li>고객 상담 및 문의 응답</li>
                <li>마케팅 및 광고 활용</li>
                <li>서비스 개선 및 통계 분석</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. 처리하는 개인정보의 항목</h2>
              <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>필수항목: 성명, 연락처(전화번호, 이메일)</li>
                <li>선택항목: 회사명, 직책</li>
                <li>자동수집항목: 접속 IP, 쿠키, 접속 기록</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. 개인정보의 처리 및 보유기간</h2>
              <p>개인정보는 수집·이용 목적이 달성된 후에는 지체없이 파기됩니다. 단, 다음의 경우는 명시한 기간 동안 보존합니다.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. 개인정보의 제3자 제공</h2>
              <p>회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. 정보주체의 권리·의무 및 행사방법</h2>
              <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>개인정보의 정정·삭제 요구</li>
                <li>손해배상 청구</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. 개인정보 보호책임자</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>개인정보 보호책임자:</strong> 마루컴시스 대표</p>
                <p><strong>연락처:</strong> ottmaru1@gmail.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. 개인정보처리방침 변경</h2>
              <p>본 개인정보처리방침은 2025년 1월 13일부터 적용됩니다.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}