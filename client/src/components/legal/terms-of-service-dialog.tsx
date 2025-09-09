import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceDialogProps {
  children: React.ReactNode;
}

export default function TermsOfServiceDialog({ children }: TermsOfServiceDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">이용약관</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="text-center">
              <p className="text-gray-600">
                마루컴시스(이하 "회사")가 제공하는 OTT 솔루션 및 관련 서비스의 이용과 관련하여 회사와 이용자간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h3>
              <p className="text-gray-700">
                이 약관은 마루컴시스(이하 "회사")가 제공하는 OTT PLUS, StreamPlayer, 넷플릭스 계정 대행, 노하드 시스템 등의 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제2조 (정의)</h3>
              <p className="text-gray-700 mb-3">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>"서비스"라 함은 회사가 제공하는 OTT 통합 솔루션, 스트리밍 플레이어, 계정 관리 서비스, 시스템 솔루션 등을 의미합니다.</li>
                <li>"이용자"라 함은 회사의 서비스를 이용하는 개인 또는 법인을 의미합니다.</li>
                <li>"계약"이라 함은 이 약관을 포함하여 서비스 이용과 관련하여 회사와 이용자 간에 체결하는 모든 계약을 의미합니다.</li>
                <li>"콘텐츠"라 함은 서비스를 통해 제공되는 OTT 플랫폼의 영상, 음원, 텍스트, 이미지 등 모든 정보나 자료를 의미합니다.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제3조 (약관의 효력 및 변경)</h3>
              <p className="text-gray-700 mb-3">
                ① 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.
              </p>
              <p className="text-gray-700 mb-3">
                ② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있으며, 약관이 변경되는 경우 변경된 약관의 적용일자 및 변경사유를 명시하여 현행약관과 함께 회사의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
              </p>
              <p className="text-gray-700">
                ③ 이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 탈퇴할 수 있습니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제4조 (서비스의 제공)</h3>
              <p className="text-gray-700 mb-3">
                ① 회사는 다음과 같은 서비스를 제공합니다.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>OTT PLUS: 숙박업소용 통합 OTT 셋톱박스 솔루션</li>
                <li>StreamPlayer: PC 기반 OTT 통합 플레이어</li>
                <li>넷플릭스 계정 대행: 넷플릭스 계정 관리 서비스</li>
                <li>노하드 시스템: PC방용 디스크리스 시스템</li>
                <li>기타 회사가 추가로 개발하거나 제휴계약 등을 통해 회원들에게 제공하는 일체의 서비스</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제5조 (서비스 이용계약의 성립)</h3>
              <p className="text-gray-700 mb-3">
                ① 서비스 이용계약은 이용자의 서비스 이용 신청에 대해 회사가 승낙함으로써 성립됩니다.
              </p>
              <p className="text-gray-700 mb-3">
                ② 회사는 다음 각 호에 해당하는 경우 이용 신청에 대한 승낙을 하지 않을 수 있습니다.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>이용 신청서의 내용을 허위로 기재하거나 이용 신청 요건을 충족하지 못한 경우</li>
                <li>회사의 기술상 지장이 있는 경우</li>
                <li>기타 회사가 필요에 의해 별도로 정한 제반 사항을 위반하며 신청하는 경우</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제6조 (서비스 이용료 및 결제)</h3>
              <p className="text-gray-700 mb-3">
                ① 회사가 제공하는 서비스는 기본적으로 유료이며, 서비스별 이용료는 회사의 정책에 따라 별도로 정해집니다.
              </p>
              <p className="text-gray-700 mb-3">
                ② 이용료의 결제방법은 계좌이체, 신용카드 결제, 기타 회사가 정하는 방법으로 가능합니다.
              </p>
              <p className="text-gray-700">
                ③ 이용료는 매월 선불로 결제하는 것을 원칙으로 하며, 이용료 납부일은 계약 체결일을 기준으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제7조 (회사의 의무)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>회사는 계속적이고 안정적인 서비스의 제공을 위하여 최선을 다합니다.</li>
                <li>회사는 이용자가 안전하게 서비스를 이용할 수 있도록 개인정보보호를 위한 보안시스템을 구축합니다.</li>
                <li>회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 처리하여야 합니다.</li>
                <li>회사는 이용자에게 서비스 이용에 필요한 기술적 지원을 제공합니다.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제8조 (이용자의 의무)</h3>
              <p className="text-gray-700 mb-3">
                ① 이용자는 서비스 이용과 관련하여 다음 행위를 하여서는 안 됩니다.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>이용 신청 또는 변경 시 허위 내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사나 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사나 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>서비스를 영리목적으로 이용하는 행위</li>
                <li>기타 불법적이거나 부당한 행위</li>
              </ul>
              <p className="text-gray-700 mt-3">
                ② 이용자는 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제9조 (서비스의 중단)</h3>
              <p className="text-gray-700 mb-3">
                회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있으며, 국가비상사태, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 때에는 서비스의 전부 또는 일부를 제한하거나 정지할 수 있습니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제10조 (계약해지 및 서비스 이용제한)</h3>
              <p className="text-gray-700 mb-3">
                ① 이용자는 언제든지 서비스 이용계약 해지를 요청할 수 있으며, 회사는 관련법령 등이 정하는 바에 따라 이를 즉시 처리하여야 합니다.
              </p>
              <p className="text-gray-700 mb-3">
                ② 회사는 이용자가 다음 각 호에 해당하는 행위를 하였을 경우 사전통지 없이 이용계약을 해지하거나 또는 기간을 정하여 서비스 이용을 중단할 수 있습니다.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>이용료를 정해진 기일에 납부하지 않는 경우</li>
                <li>타인의 서비스 이용을 방해하거나 그 정보를 도용하는 등의 행위를 하는 경우</li>
                <li>서비스를 이용하여 법령과 이 약관이 금지하는 행위를 하는 경우</li>
                <li>기타 회사가 서비스 제공자로서 현저히 부적당하다고 인정하는 경우</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제11조 (손해배상 및 면책조항)</h3>
              <p className="text-gray-700 mb-3">
                ① 회사는 무료로 제공되는 서비스와 관련하여 이용자에게 어떠한 손해가 발생하더라도 회사가 고의 또는 중대한 과실로 인한 손해를 제외하고는 이에 대하여 책임을 부담하지 아니합니다.
              </p>
              <p className="text-gray-700">
                ② 이용자가 본 약관의 규정을 위반함으로 인하여 회사에 손해가 발생하게 되는 경우, 이 약관을 위반한 이용자는 회사에 발생하는 모든 손해를 배상하여야 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제12조 (분쟁해결)</h3>
              <p className="text-gray-700">
                회사와 이용자간에 발생한 분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원으로 합니다.
              </p>
            </section>

            <section className="bg-blue-50 p-4 rounded">
              <h3 className="text-lg font-bold text-blue-900 mb-2">부칙</h3>
              <div className="text-blue-800 space-y-1">
                <p><strong>제1조 (시행일)</strong> 본 약관은 2024년 1월 1일부터 적용됩니다.</p>
                <p><strong>제2조 (경과조치)</strong> 본 약관 시행 이전에 체결된 계약에 대해서는 개정된 약관을 적용합니다.</p>
              </div>
            </section>

            <section className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-bold text-gray-900 mb-2">문의처</h3>
              <div className="text-gray-700 space-y-1">
                <p><strong>회사명:</strong> 마루컴시스</p>
                <p><strong>대표:</strong> 은정웅</p>
                <p><strong>주소:</strong> 경기도 군포시 번영로28번길 45-36</p>
                <p><strong>고객센터:</strong> 070-8080-0953</p>
                <p><strong>이메일:</strong> marucs@marucs.kr</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}