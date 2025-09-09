import { Linkedin, Mail, UserPlus } from "lucide-react";

export function TeamSection() {
  const teamMembers = [
    {
      name: "김철수",
      position: "CEO",
      experience: "15년 IT 업계 경험",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    },
    {
      name: "박영희",
      position: "CTO",
      experience: "12년 기술 개발 경험",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    },
    {
      name: "이민수",
      position: "개발팀장",
      experience: "10년 풀스택 개발 경험",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    },
    {
      name: "최수진",
      position: "디자인 총괄",
      experience: "8년 UI/UX 디자인 경험",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="team" className="py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">전문가 팀</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            풍부한 경험과 전문성을 갖춘 최고의 인재들이 고객의 성공을 위해 최선을 다합니다.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all group">
              <img 
                src={member.image} 
                alt={`${member.name} ${member.position}`} 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform"
                data-testid={`team-member-${index}`}
              />
              <h3 className="text-xl font-bold text-slate-800 mb-2">{member.name}</h3>
              <p className="text-brand-blue font-medium mb-3">{member.position}</p>
              <p className="text-sm text-slate-600 mb-4">{member.experience}</p>
              <div className="flex justify-center space-x-3">
                <button className="text-slate-400 hover:text-brand-blue transition-colors" data-testid={`linkedin-${index}`}>
                  <Linkedin size={20} />
                </button>
                <button className="text-slate-400 hover:text-brand-blue transition-colors" data-testid={`email-${index}`}>
                  <Mail size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">함께 일할 인재를 찾고 있습니다</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              혁신적인 기술과 창의적인 솔루션으로 미래를 만들어갈 열정적인 동료를 기다립니다.
            </p>
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-brand-blue text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
              data-testid="button-careers"
            >
              <UserPlus className="mr-2" size={16} />
              채용 정보 보기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
