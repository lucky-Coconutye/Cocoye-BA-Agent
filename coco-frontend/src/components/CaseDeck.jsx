
import { useTransform, motion, useMotionValue, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { TooltipContent, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { FileSpreadsheet, User, RefreshCw, Sparkles, Zap, FileText, Compass, Hand, ArrowRight, ChevronRight, PieChart, X, ThumbsUp, ThumbsDown, ArrowUpRight, MoveHorizontal, Layers, ChevronLeft, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// 提取卡片内容为纯展示组件，方便在不同容器中复用
const CardContent = ({ item, className }) => (<div className="relative w-full h-full group bg-white overflow-hidden select-none pointer-events-none">
        {/* Image Section */}
        <div className="absolute top-0 w-full h-full"><img 
                src={`https://nocode.meituan.com/photo/search?keyword=${item.imageKeyword}&width=400&height=250`}
                alt=""
                className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
             
             {/* Icon */}
             <div className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-white shadow-sm">
                <item.icon className="w-3.5 h-3.5" />
             </div>
        </div>

        {/* Text Section */}
        <div className="absolute bottom-0 w-full h-auto min-h-[35%] flex flex-col justify-end px-4 py-3bg-transparent z-10">
            <h4 className="font-bold text-sm mb-1leading-tight tracking-tight line-clamp-1 text-white shadow-black/50drop-shadow-sm">
                {item.title}
            </h4>
            <p className={cn(
                "text-[10px] leading-relaxed font-medium line-clamp-2 text-gray-200 shadow-black/50 drop-shadow-sm",
                className?.includes('w-32') && "hidden"
            )}>
                {item.desc}
            </p>
        </div>
    </div>
);

const CaseCard = ({ item, isSelected, isActive, onClick, onHover, className }) => {
  return (
    <motion.div
      layoutId={`card-${item.id}`}
      className={cn(
        "flex-shrink-0 w-64 h-36 rounded-2xl border cursor-pointer relative overflow-hidden transition-all duration-500 mx-2 bg-white",
        isActive? "scale-105 border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-10" 
            : "scale-95 border-gray-100 opacity-80 hover:opacity-100 hover:scale-100 shadow-sm",
        isSelected && "opacity-0",
        className
      )}
      onClick={() => onClick(item)}
      onMouseEnter={() => onHover(item)}>
        <CardContent item={item} className={className} />
    </motion.div>
  );
};

// 重写：SwipeableDeck - 移除拖拽功能，仅保留点击切换，增加自动播放和渐隐效果
const SwipeableDeck = ({ items, onSelect }) => {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // 确保有数据
    if (!items || items.length === 0) return null;
    
    const currentItem = items[index % items.length];
    const nextItem = items[(index + 1) % items.length];

    // 按钮手动触发 - 平滑切换
    const handleNext = () => {
        setIndex((prev) => prev + 1);
    };

    // 自动播放逻辑
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setIndex((prev) => prev + 1);
        }, 4000); // 4秒自动切换
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div 
            className="relative w-64 h-36 perspective-1000 z-10 group select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
             {/* Next Card (Background Stack Effect) */}
             <div className="absolute inset-0 z-0 flex items-center justify-center"><div className="w-full h-full rounded-2xl border border-gray-100 bg-gray-50 shadow-sm overflow-hidden scale-[0.92] translate-y-3opacity-60transition-all duration-300"><CardContent item={nextItem} /><div className="absolute inset-0 bg-white/40 pointer-events-none" />
                </div>
             </div>

             {/* Current Card (Foreground) */}
             <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 z-10 rounded-2xl border border-gray-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelect(currentItem)}
                >
                    <CardContent item={currentItem} />
                </motion.div></AnimatePresence>

             {/* Manual Control - Single Arrow Button in Bottom Right */}
             <div className="absolute bottom-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                    size="icon" 
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100 transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                    }}
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
             </div>
        </div>
    );
};

export const CaseDeck = ({ isOpen, onClose, onSelect, onCardHover, onActiveChange, mode = 'default' }) => {
  const deckRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const resumeTimerRef = useRef(null);

  // 默认推荐案例
  const defaultCases = [
    {
      id: 1,
      category: "数据清洗",
      title: "Q1电商销售数据异常值处理",
      desc: "检测销售额列中的离群值,并使用线性插值法进行填补,输出清洗后的Excel。",
      prompt: "请帮我检测这份Q1销售数据Excel中的异常值,特别是销售额那一列。对于离群值,请使用线性插值法填补,并给我一个清洗后的版本。",
      icon: User,
      color: "bg-blue-500",
      imageKeyword: "excel data spreadsheet,chart"
    },
    {
      id: 2,
      category: "图表生成",
      title: "用户留存与获客成本双轴图",
      desc: "绘制双轴图表,左轴显示月度留存率,右轴显示CAC,分析两者相关性。",
      prompt: "根据提供的数据,帮我画一个双轴图。左轴是月度用户留存率(折线),右轴是获客成本CAC(柱状),我想看下这两者最近半年有没有相关性。",
      icon: Flame,
      color: "bg-rose-500",
      imageKeyword: "growth chart,analytics graph"
    },
    {
      id: 3,
      category: "报告润色",
      title: "新产品上市复盘报告优化",
      desc: "精简这份复盘文档的语言,使其更具商务专业感,并生成执行摘要。",
      prompt: "阅读这份新产品上市复盘文档,帮我润色一下语言,使其听起来更专业、精简。另外,请在开头生成一段200字的执行摘要。",
      icon: Compass,
      color: "bg-purple-500",
      imageKeyword: "businessdocument,writing"
    },
    {
      id: 4,
      category: "竞品分析",
      title: "瑞幸vs星巴克价格带对比",
      desc: "抓取并分析两大品牌的SKU价格分布,生成箱线图对比。",
      prompt: "我想对比一下瑞幸和星巴克目前的主力产品价格带。请帮我分析他们的SKU价格分布,最好能生成一个箱线图来直观对比。",
      icon: Compass,
      color: "bg-violet-500",
      imageKeyword: "coffee chart,comparison graph"
    },
     {
      id: 5,
      category: "库存管理",
      title: "预测下季度SKU库存周转",
      desc: "基于历史出库数据,预测下季度各SKU的周转天数,标记滞销风险。",
      prompt: "这是过去一年的出库记录,请基于此预测下个季度各SKU的库存周转天数,并把可能出现滞销风险的商品标记出来。",
      icon: User,
      color: "bg-indigo-500",
      imageKeyword: "warehouse boxes,logistics chart"
    },
    {
      id: 6,
      category: "社媒分析",
      title: "小红书爆款笔记关键词",
      desc: "分析美妆类目Top100笔记，提取高频关键词和封面设计规律。",
      prompt: "帮我分析一下最近一周小红书美妆类目的Top100爆款笔记，提取出标题中的高频关键词，并总结一下封面图的视觉特点。",
      icon: Flame,
      color: "bg-orange-500",
      imageKeyword: "social media mobile,likes"
    },
    {
      id: 7,
      category: "市场调研",
      title: "新能源车主画像调研",
      desc: "基于问卷数据，分析不同年龄段车主对续航里程的敏感度。",
      prompt: "这是我们收集的新能源车主问卷数据，请分析不同年龄段（20-30，30-40，40+）的车主对'续航里程'这一指标的关注度差异。",
      icon: Compass,
      color: "bg-teal-500",
      imageKeyword: "electric car,survey chart"
    },
    {
      id: 8,
      category: "会议提效",
      title: "自动生成会议纪要",
      desc: "提取录音中的关键决策点和待办事项，生成结构化纪要。",
      prompt: "请根据这段会议录音转文字的内容，整理一份结构化的会议纪要，重点列出达成的决议和后续的To-do List。",
      icon: Flame,
      color: "bg-yellow-500",
      imageKeyword: "meeting room,microphone"
    },
  ];

  // 今日热点案例
  const hotCases = [
    {
      id: 101,
      category: "热点追踪",
      title: "瑞幸线条小狗联名销量分析",
      desc: "分析联名活动期间各渠道销量变化，对比往期联名效果。",
      prompt: "帮我分析一下瑞幸和线条小狗联名活动期间的销量数据，并对比一下之前和猫和老鼠联名时的效果差异。",
      icon: Flame,
      color: "bg-red-500",
      imageKeyword: "coffee,dog,cartoon,chart"
    },
    {
      id: 102,
      category: "行业趋势",
      title: "2024年Q1人工智能行业投融资报告",
      desc: "梳理Q1 AI赛道投融资事件，分析资本流向和热门细分领域。",
      prompt: "生成一份2024年第一季度人工智能行业的投融资分析报告，重点关注大模型和生成式AI领域的资本流向。",
      icon: Flame,
      color: "bg-orange-500",
      imageKeyword: "ai,finance,chart,money"
    },
     {
      id: 103,
      category: "社会热点",
      title: "五一假期旅游消费数据洞察",
      desc: "基于各省市文旅局数据，分析五一假期旅游人次和收入增长情况。",
      prompt: "收集并分析五一假期各热门旅游城市的接待人次和旅游收入数据，帮我做一个可视化大屏展示。",
      icon: Flame,
      color: "bg-yellow-500",
      imageKeyword: "travel,map,china,holiday"
    },
    {
      id: 104,
      category: "娱乐热搜",
      title: "《歌手2024》首播社交媒体声量分析",
      desc: "抓取微博和小红书相关讨论，分析观众情感倾向和热门槽点。",
      prompt: "帮我分析一下《歌手2024》首播后在社交媒体上的舆情，统计一下观众的主要观点和情感倾向。",
      icon: Flame,
      color: "bg-purple-500",
      imageKeyword: "music,stage,singer,social"
    },
    {
      id: 105,
      category: "科技前沿",
      title: "GPT-4o发布会对开发者生态的影响",
      desc: "分析OpenAI最新发布会内容，解读对应用层开发者的机遇与挑战。",
      prompt: "详细解读一下GPT-4o发布会的核心内容，并分析这对我们做AI应用开发的团队有哪些具体的影响和机会。",
      icon: Flame,
      color: "bg-blue-500",
      imageKeyword: "robot,future,technology,code"
    }
  ];

  // Modified: Decouple left/right data. Left is always Hot, Right is default (Personalized)
  // This ensures the labels "今日热点" and "个性化灵感库推荐" always match the content.
  const leftDeckCases = hotCases;
  const rightCarouselCases = defaultCases;

  const [displayCases, setDisplayCases] = useState(rightCarouselCases.slice(0, 5));

  // Handle Refresh specifically for the right carousel
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // 模拟刷新延迟和随机排序
    setTimeout(() => {
        const shuffled = [...rightCarouselCases].sort(() => 0.5 - Math.random());
        setDisplayCases(shuffled.slice(0, 5));
        setIsRefreshing(false);
        if (emblaApi) emblaApi.scrollTo(0);
    }, 500);
  }, [rightCarouselCases, emblaApi]);

  // 监听 Embla 滚动事件，更新选中索引并通知父组件
  const onSelectEmbla = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    if (onActiveChange && displayCases[index]) {
        onActiveChange(displayCases[index].prompt);
    }
  }, [emblaApi, onActiveChange, displayCases]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelectEmbla();
    emblaApi.on('select', onSelectEmbla);
    return () => {
        emblaApi.off('select', onSelectEmbla);
    };
  }, [emblaApi, onSelectEmbla]);

  // 自动播放逻辑 - 5秒一次
  useEffect(() => {
    if (!isPlaying || !emblaApi) return;
    const interval = setInterval(() => {emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, emblaApi]);

  // 暂停并延迟恢复播放
  const pauseAndResumeLater = useCallback(() => {
    setIsPlaying(false);
    if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
        setIsPlaying(true);
    }, 10000); 
  }, []);
  
  // 清理定时器
  useEffect(() => {
      return () => {
          if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      };
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
    pauseAndResumeLater();
  }, [emblaApi, pauseAndResumeLater]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
    pauseAndResumeLater();
  }, [emblaApi, pauseAndResumeLater]);


  // Wrapper for selection to distinguish between hot and normal
  const handleHotSelect = (item) => {
      if (onSelect) onSelect(item, 'hot');
  };

  const handleNormalSelect = (item) => {
      if (onSelect) onSelect(item, 'default');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="w-full overflow-hidden"
        >
            <div ref={deckRef} className="relative group/deck flex flex-col gap-2">
                 {/* Header Section */}
                 <div className="flex items-center gap-6 mb-1">
                    {/* Left Deck Header:今日热点 */}
                    <div className="flex-shrink-0 pl-1"><div className="w-64 flex items-center gap-1.5">
                             <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                             <span className="text-sm font-medium text-gray-500">今日热点</span>
                        </div>
                    </div>

                    {/* Placeholder for Divider alignment */}
                    <div className="w-px invisible" aria-hidden="true" />

                    {/* Right Header: 个性化推荐 */}
                    <div className="flex-1 flex items-center justify-between min-w-0 -ml-1">
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-normal text-gray-500 transition-all duration-300">
                                个性化灵感库推荐
                            </span>
                            <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleRefresh}
                                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-all group/btn"
                                    >
                                        <RefreshCw className={cn(
                                            "w-3.5 h-3.5 transition-transform duration-500",
                                            isRefreshing ? "animate-spin" : "group-hover/btn:rotate-180"
                                        )} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>换一批</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                     </div>
                 </div>
                {/* Content Section */}
                <div className="flex items-center gap-6">
                    {/* Left: Tinder Style Swipeable Deck (Always Hot Cases) */}
                    <div className="flex-shrink-0 pl-1">
                        <SwipeableDeck items={leftDeckCases} onSelect={handleHotSelect} />
                    </div>

                    {/* Divider */}
                    <div className="w-px h-32 bg-gray-100" />

                    {/* Right: Carousel (Always Personalized Cases) */}
                    <div className="flex-1 min-w-0 relative group/carousel">
                        {/* Left Nav Button */}
                        <button
                            onClick={scrollPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-gray-800 hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Embla Carousel */}
                        <div 
                            className="overflow-hidden py-2 px-1" 
                            ref={emblaRef}
                            onClick={pauseAndResumeLater}
                        >
                            <div className="flex -ml-4 items-center h-40">
                                {displayCases.map((item, index) => (
                                    <div className="flex-[0_0_auto] pl-4" key={item.id}>
                                        <CaseCard 
                                            item={item} 
                                            isActive={index === selectedIndex}
                                            onClick={handleNormalSelect}
                                            onHover={onCardHover}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Nav Button */}
                        <button
                            onClick={scrollNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-gray-800 hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        {/* Gradient Masks */}
                        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
                        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
                    </div>
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CaseDeck;
