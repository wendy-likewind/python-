import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WENDY_INFO, CHAT_KNOWLEDGE, NOTION_KNOWLEDGE } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, User, Bot, Briefcase, Zap, Heart, ExternalLink, ArrowRight, Mail, MessageSquare, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const Home = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: "你好！我是 Wendy 的数字分身。我已同步 Wendy 的公开个人资料与 Notion 知识库（包含职业履历、读书笔记、香港吃喝玩乐与宝藏酒吧攻略等）。你可以在这里向我提问，或者点击下方的预设问题了解我。" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text } as const];
    setMessages(newMessages);
    setInputValue('');
    setIsChatActive(true);

    // Simulate thinking & smart knowledge search
    setTimeout(() => {
      let response = CHAT_KNOWLEDGE.fallback;
      const lowerText = text.toLowerCase();

      // 1. Check exact presets
      const presetMatch = CHAT_KNOWLEDGE.presets.find(p => p.question === text);
      if (presetMatch) {
        response = presetMatch.answer;
      } 
      // 2. Personal Identity & Profile
      else if (lowerText.includes('你是谁') || lowerText.includes('介绍下自己') || lowerText.includes('自我介绍')) {
        response = `我是${WENDY_INFO.name}，一个会风水学、八字命理的金融产品经理、哲学爱好者、户外爱好者和播客主。很高兴认识你！`;
      } 
      // 3. Work Experience & Banking Career
      else if (lowerText.includes('职业') || lowerText.includes('工作') || lowerText.includes('经历') || lowerText.includes('履历') || lowerText.includes('银行') || lowerText.includes('工银') || lowerText.includes('招商')) {
        response = `我目前在${WENDY_INFO.experience[0].company}担任${WENDY_INFO.experience[0].role}，主导过跨境线上 eKYC 服务升级和工银智投资理财模块搭建；之前在招商永隆银行负责数字运营与美股在线开户等项目。`;
      } 
      // 4. Education
      else if (lowerText.includes('教育') || lowerText.includes('学校') || lowerText.includes('大学') || lowerText.includes('硕士') || lowerText.includes('本科') || lowerText.includes('专业')) {
        response = `我硕士毕业于${WENDY_INFO.education[0].school}${WENDY_INFO.education[0].degree}，本科毕业于${WENDY_INFO.education[1].school}会计学（注册会计方向），期间还辅修了武汉大学的金融学。`;
      } 
      // 5. Current Focus
      else if (lowerText.includes('在做') || lowerText.includes('忙什么') || lowerText.includes('现状') || lowerText.includes('最近')) {
        response = `我最近主要在忙：${WENDY_INFO.focus.join('和')}。长期关注并学习的领域还有${WENDY_INFO.longTermFocus.join('和')}。`;
      } 
      // 6. Notion: Hong Kong Bars & Nightlife
      else if (lowerText.includes('酒吧') || lowerText.includes('调酒') || lowerText.includes('bar') || lowerText.includes('夜生活') || lowerText.includes('喝酒')) {
        const barList = NOTION_KNOWLEDGE.bars.slice(0, 4).map(b => `• ${b.name}（${b.rank || '热门'}）：${b.note}，推荐酒款：${b.rec || '经典特调'}`).join('\n');
        response = `根据我整理的香港酒吧攻略，强烈推荐你去体验以下这几家高水准 Bar：\n${barList}\n另外还有中环的高空日落酒吧 Popinjays，景观也非常绝！`;
      }
      // 7. Notion: Hong Kong Food & Restaurants
      else if (lowerText.includes('吃') || lowerText.includes('餐厅') || lowerText.includes('美食') || lowerText.includes('早茶') || lowerText.includes('粤菜') || lowerText.includes('饭店') || lowerText.includes('甜品')) {
        response = `香港好吃的太多了！分享几个我 Notion 里的私藏：\n• 地道早茶/夜宵：新兴食家（建议凌晨去吃）\n• 传统精致粤菜：和昌饭店，顶级老钱风可以试大班楼（每年仅开放预订4次）\n• 地道小吃：天后的华姐清汤腩、龙记饭店烧腊\n• 日式：挽肉与米（日式汉堡排，需要提前一周抢号）\n• 甜品：尝雪（手工糯米糍）、前四季大厨开的 James Bonbon。`;
      }
      // 8. Notion: Hong Kong Citywalk & Art/Culture
      else if (lowerText.includes('citywalk') || lowerText.includes('漫步') || lowerText.includes('散步') || lowerText.includes('玩') || lowerText.includes('攻略') || lowerText.includes('艺术') || lowerText.includes('大馆') || lowerText.includes('画廊')) {
        response = `香港非常适合 Citywalk！我个人最喜欢的路线是：\n【艺术人文线】：尖沙咀香港艺术馆 → K11 Musea → 坐天星小轮上层（尖沙咀往中环坐右边好拍照） → 大馆 Tai Kwun → 元创方 PMQ → 嘉咸街壁画。\n【惬意街区线】：湾仔蓝屋 → 利东街 → 日月星街。\n中环还有白立方、艺术门等顶级画廊，很适合放慢脚步逛一下午。`;
      }
      // 9. Notion: Reading & Books
      else if (lowerText.includes('书') || lowerText.includes('阅读') || lowerText.includes('读书笔记')) {
        response = `我一直有保持阅读和做 Notion 笔记的习惯，近期笔记库里的书籍包括：${NOTION_KNOWLEDGE.readingBooks.slice(0, 6).join('、')}等。我对心流认知、习惯养成和投资心理学格外感兴趣。`;
      }
      // 10. Interests
      else if (lowerText.includes('兴趣') || lowerText.includes('爱好') || lowerText.includes('喜欢') || lowerText.includes('钢管舞') || lowerText.includes('潜水') || lowerText.includes('登山')) {
        response = `我的兴趣非常多元：${WENDY_INFO.interests.join('、')}。户外和极限运动能让我完全专注呼吸并活在当下；玄学和风水则帮我用另一种视角看待世界与周期。`;
      } 
      // 11. Traits & Values
      else if (lowerText.includes('擅长') || lowerText.includes('特点') || lowerText.includes('优势') || lowerText.includes('遗愿清单')) {
        response = `我的个人特点是：${WENDY_INFO.traits.join('；')}。`;
      } 
      // 12. Social Work
      else if (lowerText.includes('社团') || lowerText.includes('理事') || lowerText.includes('社会工作') || lowerText.includes('校友会')) {
        response = `我现在担任${WENDY_INFO.socialWork[0].org}和${WENDY_INFO.socialWork[1].org}的理事，主要负责维护成员联络与组织两地交流活动。`;
      } 
      // 13. Contact Info
      else if (lowerText.includes('联系') || lowerText.includes('微信') || lowerText.includes('邮箱') || lowerText.includes('找你') || lowerText.includes('合作')) {
        response = `你可以通过微信（${WENDY_INFO.contact.wechat}）或邮件（${WENDY_INFO.contact.email}）直接联系我，非常欢迎真诚交流！`;
      } 
      // 14. Projects & Works
      else if (lowerText.includes('作品') || lowerText.includes('项目')) {
        response = `你可以在页面上的画框超链接中查看我的职业履历文档、香港吃喝玩乐集合攻略，以及我的 Instagram 钢管舞作品展示。`;
      }

      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    }, 600);
  };

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#2C3531] selection:bg-[#A8C6A1]/30 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-24">
        
        {/* Profile Header */}
        <section className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-b from-[#A8C6A1]/20 to-transparent rounded-full blur-xl"></div>
            <img 
              src={WENDY_INFO.avatar} 
              alt={WENDY_INFO.name} 
              className="relative w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-sm"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#2C3531]">{WENDY_INFO.name}</h1>
            <p className="text-[#5B8FA8] text-xl md:text-2xl font-light max-w-xl mx-auto leading-relaxed text-pretty">
              {WENDY_INFO.intro}
            </p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <Button 
              onClick={scrollToChat}
              className="bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white rounded-full px-8 py-6 gap-2 text-lg font-medium group shadow-lg shadow-[#A8C6A1]/20 transition-all hover:scale-105"
            >
              和我聊聊 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-6 py-6 gap-2 text-base border-[#5B8FA8]/30 text-[#5B8FA8] hover:bg-[#5B8FA8]/5 hover:text-[#5B8FA8]"
            >
              <Link to="/job-coach">
                <Compass className="w-4 h-4" /> 港 fintech 求职陪跑
              </Link>
            </Button>
            <Link
              to="/workbench"
              className="text-sm font-normal text-[#2C3531]/45 hover:text-[#5B8FA8] transition-colors underline-offset-4 hover:underline px-1"
            >
              今日工作台
            </Link>
          </div>
        </section>

        {/* Info Blocks */}
        <div className="grid grid-cols-1 gap-16">
          
          {/* Status & Interests Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#A8C6A1]">
                <Zap className="w-5 h-5" />
                <h3 className="font-medium tracking-wide uppercase text-sm">正在忙碌</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {WENDY_INFO.focus.map((item, i) => (
                  <span key={i} className="text-lg text-[#2C3531]/80 border-b border-[#A8C6A1]/30 pb-1">{item}</span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#5B8FA8]">
                <Heart className="w-5 h-5" />
                <h3 className="font-medium tracking-wide uppercase text-sm">兴趣爱好</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {WENDY_INFO.interests.map((item, i) => (
                  <Badge key={i} variant="secondary" className="bg-[#5B8FA8]/5 text-[#5B8FA8] hover:bg-[#5B8FA8]/10 border-none font-normal px-3 py-1 text-sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Traits Section - Text Content */}
          <div className="space-y-8 pt-8 border-t border-[#A8C6A1]/10">
            <div className="flex items-center gap-2 text-[#A8C6A1]">
              <Briefcase className="w-5 h-5" />
              <h3 className="font-medium tracking-wide uppercase text-sm">我的特点</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {WENDY_INFO.traits.map((trait, i) => (
                <p key={i} className="text-base text-[#2C3531]/70 leading-relaxed pl-4 border-l-2 border-[#A8C6A1]/20">
                  {trait}
                </p>
              ))}
            </div>
          </div>

          {/* New Image Links Section - Framed and Aligned */}
          <div className="space-y-8 pt-8 border-t border-[#A8C6A1]/10">
            <div className="flex items-center gap-2 text-[#5B8FA8]">
              <ExternalLink className="w-5 h-5" />
              <h3 className="font-medium tracking-wide uppercase text-sm">更多内容</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Object.entries(WENDY_INFO.links).map(([key, link]) => (
                <a 
                  key={key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col space-y-3"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-sm transition-all group-hover:shadow-md group-hover:scale-[1.02] bg-white">
                    <img 
                      src={link.image} 
                      alt={link.label} 
                      className="w-full h-full object-cover transition duration-500 group-hover:opacity-90"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#2C3531]/60 group-hover:text-[#5B8FA8] transition-colors flex items-center gap-1 px-1">
                    {link.label} <ArrowRight className="w-3 h-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-8 pt-8 border-t border-[#A8C6A1]/10">
            <div className="flex items-center gap-2 text-[#A8C6A1]">
              <Mail className="w-5 h-5" />
              <h3 className="font-medium tracking-wide uppercase text-sm">联系我</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
              <div className="flex items-center gap-3 group">
                <div className="p-3 rounded-2xl bg-white shadow-sm border border-[#A8C6A1]/10">
                  <MessageSquare className="w-5 h-5 text-[#A8C6A1]" />
                </div>
                <div>
                  <p className="text-xs text-[#2C3531]/40 uppercase tracking-wider mb-0.5">WeChat</p>
                  <p className="text-base font-medium text-[#2C3531]/80 select-all">{WENDY_INFO.contact.wechat}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-3 rounded-2xl bg-white shadow-sm border border-[#A8C6A1]/10">
                  <Mail className="w-5 h-5 text-[#A8C6A1]" />
                </div>
                <div>
                  <p className="text-xs text-[#2C3531]/40 uppercase tracking-wider mb-0.5">Email</p>
                  <a href={`mailto:${WENDY_INFO.contact.email}`} className="text-base font-medium text-[#2C3531]/80 hover:text-[#5B8FA8] transition-colors select-all">
                    {WENDY_INFO.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <section 
          ref={chatSectionRef}
          className="space-y-8 pt-16 border-t border-[#A8C6A1]/10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#5B8FA8]/10 rounded-2xl">
                  <MessageCircle className="w-6 h-6 text-[#5B8FA8]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold">数字分身</h2>
              </div>
              <p className="text-sm text-[#2C3531]/50 pl-1">
                你可以在这里问我最近在做什么、我有哪些作品、怎么联系我
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 self-start md:self-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-600/80 tracking-wider uppercase">Online</span>
            </div>
          </div>

          <Card className="flex flex-col h-[500px] md:h-[600px] border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-md rounded-3xl">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-start gap-3 animate-fade-in-up",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl shrink-0 mt-1",
                    msg.role === 'user' ? "bg-[#5B8FA8]/10" : "bg-[#A8C6A1]/10"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-[#5B8FA8]" /> : <Bot className="w-4 h-4 text-[#A8C6A1]" />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] px-5 py-3 rounded-2xl text-base leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-[#5B8FA8] text-white rounded-tr-none" 
                      : "bg-[#F7F9F6] text-[#2C3531] rounded-tl-none border border-white"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white/80 border-t border-[#A8C6A1]/5 space-y-4">
              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {CHAT_KNOWLEDGE.presets.map((preset, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(preset.question)}
                    className="text-xs px-4 py-2 rounded-full border border-[#A8C6A1]/20 text-[#2C3531]/60 hover:border-[#A8C6A1] hover:text-[#A8C6A1] transition-all duration-300"
                  >
                    {preset.question}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form 
                className="relative flex items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
              >
                <Input 
                  placeholder="Ask me anything..." 
                  className="pl-4 pr-14 py-6 rounded-2xl bg-[#F7F9F6] border-none focus-visible:ring-1 focus-visible:ring-[#5B8FA8]/30 transition-all text-base"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-2 bg-[#5B8FA8] hover:bg-[#5B8FA8]/90 w-10 h-10 rounded-xl"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="pt-24 pb-12 text-center text-[#2C3531]/30 text-xs font-light tracking-widest uppercase">
          <p>© Wendy Wang — {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
