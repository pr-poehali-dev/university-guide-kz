import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const universities = [
  {
    id: 1,
    name: 'Казахский Национальный Университет им. аль-Фараби',
    shortName: 'КазНУ',
    city: 'Алматы',
    rating: 4.8,
    programs: 156,
    students: 20000,
    grants: true,
    international: true,
    image: 'https://cdn.poehali.dev/projects/2924ebd6-f0ad-41d2-b256-709f82a594bc/files/4491916f-22dc-4b1d-8bb1-49295e97d5d1.jpg',
    coordinates: { x: 520, y: 380 },
    description: 'Ведущий вуз Казахстана, основан в 1934 году',
    specialties: ['IT', 'Медицина', 'Инженерия', 'Юриспруденция'],
    tuition: '850 000 ₸',
  },
  {
    id: 2,
    name: 'Казахстанско-Британский Технический Университет',
    shortName: 'КБТУ',
    city: 'Алматы',
    rating: 4.9,
    programs: 42,
    students: 8500,
    grants: true,
    international: true,
    image: 'https://cdn.poehali.dev/projects/2924ebd6-f0ad-41d2-b256-709f82a594bc/files/ad58a655-5a5c-44b3-8ea7-8dec36878f9f.jpg',
    coordinates: { x: 520, y: 400 },
    description: 'Технический университет с международными стандартами',
    specialties: ['IT', 'Инженерия', 'Нефтегаз', 'Бизнес'],
    tuition: '1 200 000 ₸',
  },
  {
    id: 3,
    name: 'Назарбаев Университет',
    shortName: 'НУ',
    city: 'Астана',
    rating: 5.0,
    programs: 38,
    students: 4500,
    grants: true,
    international: true,
    image: 'https://cdn.poehali.dev/projects/2924ebd6-f0ad-41d2-b256-709f82a594bc/files/9b6b22ed-9e17-49a4-84fc-6340c6b28067.jpg',
    coordinates: { x: 400, y: 280 },
    description: 'Автономный университет с мировым уровнем образования',
    specialties: ['IT', 'Инженерия', 'Бизнес', 'Медицина'],
    tuition: 'Бесплатно (грант)',
  },
  {
    id: 4,
    name: 'Евразийский Национальный Университет',
    shortName: 'ЕНУ',
    city: 'Астана',
    rating: 4.6,
    programs: 124,
    students: 16000,
    grants: true,
    international: false,
    image: 'https://cdn.poehali.dev/projects/2924ebd6-f0ad-41d2-b256-709f82a594bc/files/4491916f-22dc-4b1d-8bb1-49295e97d5d1.jpg',
    coordinates: { x: 380, y: 290 },
    description: 'Классический университет со 100-летней историей',
    specialties: ['Педагогика', 'История', 'Филология', 'Юриспруденция'],
    tuition: '750 000 ₸',
  },
  {
    id: 5,
    name: 'Карагандинский Технический Университет',
    shortName: 'КарТУ',
    city: 'Караганда',
    rating: 4.5,
    programs: 89,
    students: 12000,
    grants: true,
    international: false,
    image: 'https://cdn.poehali.dev/projects/2924ebd6-f0ad-41d2-b256-709f82a594bc/files/ad58a655-5a5c-44b3-8ea7-8dec36878f9f.jpg',
    coordinates: { x: 420, y: 320 },
    description: 'Ведущий технический вуз центрального Казахстана',
    specialties: ['Горное дело', 'Инженерия', 'IT', 'Энергетика'],
    tuition: '650 000 ₸',
  },
  {
    id: 6,
    name: 'Западно-Казахстанский Университет',
    shortName: 'ЗКГУ',
    city: 'Уральск',
    rating: 4.3,
    programs: 76,
    students: 9000,
    grants: true,
    international: false,
    image: 'https://cdn.poehali.dev/projects/2924ebd6-f0ad-41d2-b256-709f82a594bc/files/4491916f-22dc-4b1d-8bb1-49295e97d5d1.jpg',
    coordinates: { x: 220, y: 310 },
    description: 'Региональный университет западного Казахстана',
    specialties: ['Педагогика', 'Экономика', 'Нефтегаз', 'Сельское хозяйство'],
    tuition: '550 000 ₸',
  },
];

const chatMessages = [
  { role: 'assistant', text: 'Здравствуйте! Я AI-помощник UniGuide. Помогу выбрать университет и программу обучения. Чем могу помочь?' },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [hoveredUni, setHoveredUni] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState(chatMessages);
  const [userInput, setUserInput] = useState('');
  const [compareList, setCompareList] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         uni.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || uni.city === selectedCity;
    const matchesSpecialty = selectedSpecialty === 'all' || uni.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  const cities = Array.from(new Set(universities.map(u => u.city)));
  const specialties = Array.from(new Set(universities.flatMap(u => u.specialties)));

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    setMessages([...messages, { role: 'user', text: userInput }]);
    
    setTimeout(() => {
      let response = '';
      const query = userInput.toLowerCase();
      
      if (query.includes('it') || query.includes('программирование') || query.includes('айти')) {
        response = 'Для IT-направления рекомендую: КазНУ (156 программ, рейтинг 4.8), КБТУ (топ по IT, рейтинг 4.9), НУ (лучшие гранты). Хотите подробнее о каком-то из них?';
      } else if (query.includes('грант') || query.includes('бесплатно')) {
        response = 'Гранты доступны во всех наших вузах! НУ предлагает 100% грантовое обучение. КазНУ и КБТУ имеют большой грантовый фонд. Какая специальность вас интересует?';
      } else if (query.includes('сравни') || query.includes('разница')) {
        response = 'Используйте функцию сравнения вузов! Можете выбрать до 4 университетов и посмотреть различия по рейтингу, стоимости, программам и трудоустройству.';
      } else if (query.includes('астана') || query.includes('нур-султан')) {
        response = 'В Астане есть НУ (рейтинг 5.0, автономный) и ЕНУ (рейтинг 4.6, классический). НУ — более престижный с грантами, ЕНУ — широкий выбор специальностей.';
      } else if (query.includes('алматы')) {
        response = 'В Алматы: КазНУ (крупнейший, 20000 студентов) и КБТУ (технический, международные стандарты). КазНУ — универсальный, КБТУ — для IT и инженерии.';
      } else {
        response = 'Могу помочь с выбором по специальности, городу или бюджету. Попробуйте спросить: "Какие вузы сильны в IT?", "Где есть гранты?", "Сравни Медицину в КазНУ и НУ"';
      }
      
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    }, 800);
    
    setUserInput('');
  };

  const toggleCompare = (id: number) => {
    setCompareList(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-4)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  UniGuide KZ
                </h1>
                <p className="text-xs text-muted-foreground">Выбирай будущее с умом</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#catalog" className="text-sm font-medium hover:text-primary transition-colors">Каталог</a>
              <a href="#map" className="text-sm font-medium hover:text-primary transition-colors">Карта</a>
              <a href="#compare" className="text-sm font-medium hover:text-primary transition-colors">Сравнение</a>
              <Button variant="default" size="sm">
                <Icon name="UserCircle" className="mr-2" size={16} />
                Войти
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6 animate-fade-in-up">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight">
              Найди свой{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                идеальный
              </span>
              <br />университет
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Более 200 программ обучения в лучших вузах Казахстана. Гранты, стипендии, международные партнёрства.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
              <div className="relative flex-1">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Поиск университетов, программ..."
                  className="pl-10 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                <Icon name="Search" className="mr-2" size={20} />
                Найти
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['IT', 'Медицина', 'Инженерия', 'Бизнес', 'Юриспруденция'].map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
                  onClick={() => setSelectedSpecialty(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-4xl font-bold mb-4">Интерактивная карта вузов</h3>
            <p className="text-muted-foreground text-lg">Наведите на город, чтобы увидеть университеты</p>
          </div>
          
          <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border-2 border-border">
            <svg viewBox="0 0 800 500" className="w-full h-auto">
              <path 
                d="M 50 100 L 750 100 L 750 400 L 400 480 L 50 400 Z" 
                fill="hsl(var(--muted))" 
                stroke="hsl(var(--border))" 
                strokeWidth="2"
              />
              
              {universities.map(uni => (
                <g 
                  key={uni.id}
                  onMouseEnter={() => setHoveredUni(uni.id)}
                  onMouseLeave={() => setHoveredUni(null)}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx={uni.coordinates.x}
                    cy={uni.coordinates.y}
                    r={hoveredUni === uni.id ? 12 : 8}
                    fill={hoveredUni === uni.id ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'}
                    className="transition-all animate-float"
                    style={{ animationDelay: `${uni.id * 0.2}s` }}
                  />
                  {hoveredUni === uni.id && (
                    <text
                      x={uni.coordinates.x}
                      y={uni.coordinates.y - 20}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-foreground animate-fade-in"
                    >
                      {uni.shortName}
                    </text>
                  )}
                </g>
              ))}
            </svg>
            
            {hoveredUni && (
              <Card className="absolute bottom-4 left-4 w-80 animate-scale-in shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {universities.find(u => u.id === hoveredUni)?.name}
                  </CardTitle>
                  <CardDescription>
                    {universities.find(u => u.id === hoveredUni)?.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-secondary" />
                      <span>{universities.find(u => u.id === hoveredUni)?.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="BookOpen" size={16} className="text-primary" />
                      <span>{universities.find(u => u.id === hoveredUni)?.programs} программ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-4xl font-bold mb-4">Каталог университетов</h3>
            <p className="text-muted-foreground text-lg">Выберите город и специальность для фильтрации</p>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
              <TabsTrigger value="all" onClick={() => setSelectedCity('all')}>Все</TabsTrigger>
              <TabsTrigger value="Алматы" onClick={() => setSelectedCity('Алматы')}>Алматы</TabsTrigger>
              <TabsTrigger value="Астана" onClick={() => setSelectedCity('Астана')}>Астана</TabsTrigger>
              <TabsTrigger value="other" onClick={() => setSelectedCity('other')}>Другие</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni, index) => (
              <Card 
                key={uni.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={uni.image} 
                    alt={uni.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {uni.grants && (
                      <Badge className="bg-secondary text-secondary-foreground">
                        <Icon name="Award" size={12} className="mr-1" />
                        Гранты
                      </Badge>
                    )}
                    {uni.international && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Icon name="Globe" size={12} className="mr-1" />
                        Международный
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{uni.name}</CardTitle>
                    <Button
                      variant={compareList.includes(uni.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCompare(uni.id)}
                      className="shrink-0"
                    >
                      <Icon name="GitCompare" size={16} />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Icon name="MapPin" size={14} />
                    {uni.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-secondary" />
                      <span className="font-semibold">{uni.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="Users" size={16} />
                      <span>{uni.students.toLocaleString()} студентов</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {uni.specialties.slice(0, 3).map(spec => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-2">{uni.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">{uni.tuition}</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" size="sm" className="p-0">
                            Подробнее
                            <Icon name="ArrowRight" size={16} className="ml-1" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{uni.name}</DialogTitle>
                            <DialogDescription>{uni.city}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img src={uni.image} alt={uni.name} className="w-full h-64 object-cover rounded-lg" />
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-semibold mb-1">Рейтинг</p>
                                <div className="flex items-center gap-1">
                                  <Icon name="Star" size={16} className="text-secondary" />
                                  <span>{uni.rating}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold mb-1">Программы</p>
                                <p>{uni.programs}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold mb-1">Студенты</p>
                                <p>{uni.students.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold mb-1">Стоимость</p>
                                <p>{uni.tuition}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold mb-2">Специальности</p>
                              <div className="flex flex-wrap gap-2">
                                {uni.specialties.map(spec => (
                                  <Badge key={spec} variant="secondary">{spec}</Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{uni.description}</p>
                            <Button className="w-full">
                              <Icon name="Send" size={16} className="mr-2" />
                              Подать заявку
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {compareList.length > 0 && (
        <section id="compare" className="py-20 px-4 bg-card">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Сравнение университетов</h3>
              <p className="text-muted-foreground text-lg">Выбрано: {compareList.length} из 4</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {compareList.map(id => {
                const uni = universities.find(u => u.id === id);
                if (!uni) return null;
                
                return (
                  <Card key={uni.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => toggleCompare(uni.id)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                    <CardHeader>
                      <CardTitle className="text-base pr-8">{uni.shortName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Рейтинг</p>
                        <p className="font-semibold">{uni.rating} / 5.0</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Программы</p>
                        <p className="font-semibold">{uni.programs}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Стоимость</p>
                        <p className="font-semibold">{uni.tuition}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Студенты</p>
                        <p className="font-semibold">{uni.students.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Гранты</p>
                        <p className="font-semibold">{uni.grants ? 'Да' : 'Нет'}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <Button
            size="lg"
            className="rounded-full w-16 h-16 shadow-2xl animate-float"
            onClick={() => setChatOpen(true)}
          >
            <Icon name="MessageCircle" size={24} />
          </Button>
        ) : (
          <Card className="w-96 h-[500px] flex flex-col shadow-2xl animate-slide-in-right">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name="Bot" className="text-white" size={20} />
                </div>
                <div>
                  <CardTitle className="text-base">AI Помощник</CardTitle>
                  <p className="text-xs text-muted-foreground">Онлайн</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
                <Icon name="X" size={20} />
              </Button>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Задайте вопрос..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Icon name="Send" size={20} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Попробуйте: "Какие вузы сильны в IT?"
              </p>
            </div>
          </Card>
        )}
      </div>

      <footer className="bg-card border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" className="text-white" size={16} />
                </div>
                <h4 className="font-bold text-lg">UniGuide KZ</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Выбирай будущее с умом. Твой университет ждёт тебя.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Университеты</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Каталог</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Рейтинги</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Карта</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Абитуриенту</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Поступление</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Гранты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Калькулятор</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Связь</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@uniguide.kz
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 777 123 45 67
                </li>
                <li className="flex gap-2 mt-4">
                  <Button variant="outline" size="icon">
                    <Icon name="Facebook" size={16} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Icon name="Instagram" size={16} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Icon name="Youtube" size={16} />
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 UniGuide KZ. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
