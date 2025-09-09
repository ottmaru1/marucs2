import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyDialogProps {
  children: React.ReactNode;
}

export default function PrivacyPolicyDialog({ children }: PrivacyPolicyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">개인정보처리방침</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="text-center">
              <p className="text-gray-600">
                마루컴시스(이하 "회사")는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제1조 (개인정보의 처리목적)</h3>
              <p className="text-gray-700 mb-3">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>서비스 제공 및 계약의 이행: OTT 솔루션, StreamPlayer, 넷플릭스 계정 대행, 노하드 시스템 등의 서비스 제공</li>
                <li>회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지</li>
                <li>고객 상담 및 서비스 개선: 민원사무 처리, 고충처리, 공지사항 전달, 서비스 개선을 위한 의견수렴</li>
                <li>마케팅 및 광고: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제2조 (개인정보의 처리 및 보유기간)</h3>
              <p className="text-gray-700 mb-3">
                ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <p className="text-gray-700 mb-3">② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>서비스 이용 관련 정보: 서비스 이용계약 종료 후 5년</li>
                <li>상담 및 문의 관련 정보: 문의 처리 완료 후 3년</li>
                <li>마케팅 정보 활용 동의: 동의 철회 시까지 또는 회원 탈퇴 시까지</li>
                <li>법령에 의한 보존: 관련 법령에서 정한 기간</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제3조 (처리하는 개인정보의 항목)</h3>
              <p className="text-gray-700 mb-3">
                회사는 다음의 개인정보 항목을 처리하고 있습니다.
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">1. 서비스 이용</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>필수항목: 회사명, 담당자명, 연락처, 이메일</li>
                    <li>선택항목: 사업자등록번호, 주소, 관심 서비스</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">2. 고객 상담</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>필수항목: 이름, 연락처, 문의내용</li>
                    <li>선택항목: 이메일, 회사명</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">3. 자동 수집 정보</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>IP주소, 쿠키, 방문일시, 서비스 이용기록, 불량 이용기록</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제4조 (개인정보의 제3자 제공)</h3>
              <p className="text-gray-700 mb-3">
                ① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
              <p className="text-gray-700">
                ② 회사는 현재 개인정보를 제3자에게 제공하고 있지 않습니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제5조 (개인정보처리의 위탁)</h3>
              <p className="text-gray-700 mb-3">
                ① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
              </p>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-700 mb-1"><strong>위탁업체:</strong> 호스팅 서비스 제공업체</p>
                <p className="text-gray-700 mb-1"><strong>위탁업무:</strong> 웹사이트 운영 및 관리</p>
                <p className="text-gray-700"><strong>위탁기간:</strong> 서비스 제공 기간</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제6조 (정보주체의 권리·의무 및 행사방법)</h3>
              <p className="text-gray-700 mb-3">
                ① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 열람요구</li>
                <li>개인정보 정정·삭제요구</li>
                <li>개인정보 처리정지요구</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제7조 (개인정보의 안전성 확보조치)</h3>
              <p className="text-gray-700 mb-3">
                회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>개인정보 취급 직원의 최소화 및 교육</li>
                <li>개인정보에 대한 접근 제한</li>
                <li>개인정보를 안전하게 저장/전송할 수 있는 암호화 기술 사용</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보처리시스템 등의 접근권한 관리</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제8조 (개인정보보호책임자)</h3>
              <p className="text-gray-700 mb-3">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">▶ 개인정보보호책임자</h4>
                <ul className="text-blue-800 space-y-1">
                  <li><strong>성명:</strong> 은정웅</li>
                  <li><strong>직책:</strong> 대표이사</li>
                  <li><strong>연락처:</strong> 070-8080-0953</li>
                  <li><strong>이메일:</strong> marucs@marucs.kr</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">제9조 (개인정보 처리방침 변경)</h3>
              <p className="text-gray-700">
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>

            <section className="bg-blue-50 p-4 rounded">
              <h3 className="text-lg font-bold text-blue-900 mb-2">시행일자</h3>
              <p className="text-blue-800">
                이 개인정보처리방침은 2024년 1월 1일부터 시행됩니다.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}