import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    document.title = "서비스 이용약관 - 마루컴시스";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">서비스 이용약관</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제1조 (목적)</h2>
              <p>이 약관은 마루컴시스(이하 "회사")가 제공하는 OTT 통합 솔루션 서비스의 이용조건 및 절차에 관한 사항과 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제2조 (정의)</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>"서비스"란 회사가 제공하는 OTT PLUS, StreamPlayer, NoHard System 등 모든 서비스를 의미합니다.</li>
                <li>"이용자"란 회사의 서비스를 이용하는 법인 고객을 의미합니다.</li>
                <li>"계약"이란 서비스 이용에 관하여 회사와 이용자 간에 체결하는 계약을 의미합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제3조 (서비스의 내용)</h2>
              <p>회사가 제공하는 서비스는 다음과 같습니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>OTT PLUS: 셋톱박스 기반 통합 OTT 솔루션</li>
                <li>StreamPlayer: PC 기반 OTT 통합 서비스</li>
                <li>NoHard System: PC방 무디스크 솔루션</li>
                <li>Netflix 계정 관리 서비스</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제4조 (계약의 성립)</h2>
              <p>서비스 이용계약은 이용자의 서비스 신청과 회사의 승낙으로 성립됩니다. 회사는 다음의 경우 승낙을 거절할 수 있습니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>신청서에 허위의 내용을 기재한 경우</li>
                <li>기술상 서비스 제공이 불가능한 경우</li>
                <li>기타 회사가 정한 이용신청 요건을 충족하지 못한 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제5조 (서비스 이용료)</h2>
              <p>서비스 이용료는 회사와 이용자 간 별도 계약으로 정하며, 사전 고지 후 변경할 수 있습니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제6조 (이용자의 의무)</h2>
              <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>타인의 개인정보를 도용하는 행위</li>
                <li>회사의 지적재산권을 침해하는 행위</li>
                <li>서비스의 안정적 운영을 방해하는 행위</li>
                <li>관련 법령을 위반하는 행위</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제7조 (서비스의 중단)</h2>
              <p>회사는 다음의 경우 서비스 제공을 중단할 수 있습니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>시스템 점검이나 보수를 위해 필요한 경우</li>
                <li>천재지변 등 불가항력적 사유가 발생한 경우</li>
                <li>전기통신사업법에 따른 기간통신사업자가 서비스를 중단한 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제8조 (손해배상)</h2>
              <p>회사는 무료 서비스와 관련하여 이용자에게 발생한 손해에 대해서는 책임을 지지 않습니다. 다만, 회사의 고의 또는 중과실로 인한 손해는 제외합니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">제9조 (준거법 및 관할법원)</h2>
              <p>이 약관에 관한 분쟁은 대한민국 법을 준거법으로 하며, 회사의 본점 소재지 관할법원에서 해결합니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">부칙</h2>
              <p>본 약관은 2025년 1월 13일부터 시행됩니다.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}