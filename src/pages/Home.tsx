import React, { useState, useRef, useEffect } from 'react';
import { WENDY_INFO, CHAT_KNOWLEDGE } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User, Bot, Mountain, Briefcase, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Home = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: "你好！我是 Wendy 的数字分身。你可以问我关于我的职业、现状、兴趣爱好，或者点击下方的预设问题了解我。" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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

    // Simulate thinking
    setTimeout(() => {
      let response = CHAT_KNOWLEDGE.fallback;
      const lowerText = text.toLowerCase();

      // Check presets
      const presetMatch = CHAT_KNOWLEDGE.presets.find(p => p.question === text);
      if (presetMatch) {
        response = presetMatch.answer;
      } else if (lowerText.includes('职业') || lowerText.includes('工作') || lowerText.includes('身份')) {
        response = `我目前是一名${WENDY_INFO.occupation}，同时也深耕金融产品、创业和播客领域。`;
      } else if (lowerText.includes('在做') || lowerText.includes('忙什么') || lowerText.includes('现状')) {
        response = `我最近主要在忙：${WENDY_INFO.focus.join('和')}。`;
      } else if (lowerText.includes('兴趣') || lowerText.includes('爱好') || lowerText.includes('喜欢')) {
        response = `我的兴趣非常广泛，包括${WENDY_INFO.interests.join('、')}等。`;
      } else if (lowerText.includes('擅长') || lowerText.includes('特点')) {
        response = `我比较擅长：${WENDY_INFO.traits.join('；')}。`;
      }

      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-secondary text-foreground selection:bg-primary/30">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-12">
        {/* Profile Header */}
        <section className="flex flex-col items-center text-center space-y-6 animate-fade-in-up">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={WENDY_INFO.avatar} 
              alt={WENDY_INFO.name} 
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-background"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">{WENDY_INFO.name}</h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-pretty">
              {WENDY_INFO.intro}
            </p>
          </div>
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Focus */}
          <Card className="bg-background/60 backdrop-blur-sm border-none shadow-sm hover:shadow-md transition-shadow animate-fade-in-up [animation-delay:100ms]">
            <CardHeader className="flex flex-row items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">正在忙碌</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {WENDY_INFO.focus.map((item, i) => (
                  <Badge key={i} variant="secondary" className="bg-primary/10 text-primary-foreground hover:bg-primary/20">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="bg-background/60 backdrop-blur-sm border-none shadow-sm hover:shadow-md transition-shadow animate-fade-in-up [animation-delay:200ms]">
            <CardHeader className="flex flex-row items-center space-x-2">
              <Heart className="w-5 h-5 text-accent" />
              <CardTitle className="text-lg">兴趣爱好</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {WENDY_INFO.interests.map((item, i) => (
                  <Badge key={i} variant="outline" className="border-accent/20 text-accent hover:bg-accent/5">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traits */}
          <Card className="md:col-span-2 bg-background/60 backdrop-blur-sm border-none shadow-sm hover:shadow-md transition-shadow animate-fade-in-up [animation-delay:300ms]">
            <CardHeader className="flex flex-row items-center space-x-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">我的特点</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WENDY_INFO.traits.map((trait, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-sm text-foreground/80 leading-relaxed">{trait}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {Object.entries(WENDY_INFO.images).map(([key, url]) => (
                  <div key={key} className="aspect-square rounded-xl overflow-hidden group relative shadow-inner bg-muted">
                    <img 
                      src={url} 
                      alt={key} 
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <section className="space-y-6 animate-fade-in-up [animation-delay:400ms]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">数字分身对话</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-600">在线</span>
            </div>
          </div>

          <Card className="flex flex-col h-[600px] border-none shadow-lg overflow-hidden bg-background">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-start gap-3 animate-fade-in",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full shrink-0",
                    msg.role === 'user' ? "bg-accent/10" : "bg-primary/10"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-accent" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-accent text-accent-foreground rounded-tr-none" 
                      : "bg-secondary text-foreground rounded-tl-none border border-border/50 shadow-sm"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-secondary/30 space-y-4">
              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {CHAT_KNOWLEDGE.presets.map((preset, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => handleSend(preset.question)}
                  >
                    {preset.question}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <form 
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
              >
                <Input 
                  placeholder="问问我的职业、现状或兴趣..." 
                  className="bg-background border-border/50 focus:ring-accent"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="bg-accent hover:bg-accent/90 shrink-0"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-8 text-center text-muted-foreground text-sm border-t border-border/50">
          <p>© 2024 Wendy Wang. Built with Vibe Coding.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
