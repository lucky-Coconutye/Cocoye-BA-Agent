import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, Share2, ThumbsUp, MessageSquare, 
  BarChart3, TrendingUp, ArrowUpRight, 
  FileText, Lightbulb, Clock, Eye
} from "lucide-react";

export function HotTopicDetail({ open, onClose, topic, onStartChat }) {
  if (!topic) return null;

  const handleStartChat = () => {
    if (onStartChat) {
        // 优先使用预设的 prompt，如果没有则使用标题
        onStartChat(topic.prompt || `帮我分析一下：${topic.title}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden bg-white h-[85vh] flex flex-col">
        
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md z-10">
           <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${topic.color || 'bg-blue-500'} bg-opacity-10`}>
                 {topic.icon ? <topic.icon className={`w-5 h-5 ${topic.color ? topic.color.replace('bg-', 'text-') : 'text-blue-600'}`} /> : <BarChart3 className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex flex-col">
                  <DialogTitle className="text-base font-semibold text-gray-900">{topic.category || "今日热点"}</DialogTitle>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2小时前更新
                      <span className="mx-1">·</span>
                      <Eye className="w-3 h-3" /> {(Math.random() * 10000 + 5000).toFixed(0)} 阅读
                  </span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                  <Share2 className="w-4 h-4" />
              </Button>
              <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
                      <X className="w-5 h-5" />
                  </Button>
              </DialogClose>
           </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
            <div className="px-8 py-8 max-w-3xl mx-auto">
                {/* Article Header */}
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-6">
                    {topic.title}
                </h1>
                
                {/* Author Info */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-100">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.title}`} />
                            <AvatarFallback>BA</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-gray-900">商业分析助手</p>
                            <p className="text-xs text-gray-500">AI 自动生成 · 数据来源可靠</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                        深度分析
                    </Badge>
                </div>

                {/* Main Cover Image */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 shadow-sm border border-gray-100 bg-gray-50">
                     <img 
                        src={`https://nocode.meituan.com/photo/search?keyword=${topic.imageKeyword || 'business chart'},analytics,data&width=800&height=450`} 
                        alt={topic.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                     />
                </div>

                {/* Abstract Section */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">核心摘要</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                        {topic.desc || "本报告针对当前热点事件进行了深入的数据挖掘与分析。通过多维度指标对比，揭示了背后的商业逻辑与市场趋势。"}
                        {" "}根据最新数据监测显示，该话题在过去24小时内热度持续攀升，并在多个社交平台引发广泛讨论。报告重点分析了用户关注焦点的转移路径，以及潜在的商业机会点。
                    </p>
                </div>

                {/* Content Body - Simulated Rich Text */}
                <div className="space-y-8 text-gray-800 leading-7">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                            趋势背景分析
                        </h2>
                        <p className="mb-4">
                            随着市场环境的快速变化，传统分析模型已难以捕捉瞬息万变的消费趋势。本次分析基于全网公开数据，结合内部独有的AI算法模型，对<b>{topic.title}</b>进行了全方位的解构。
                        </p>
                        <p>
                            数据显示，关键指标环比增长显著，特别是在核心用户群体中，渗透率提升了约15%。这一变化不仅反映了市场需求的回暖，也预示着下一阶段竞争格局的重塑。
                        </p>
                    </section>
                    
                    {/* Simulated Chart Image */}
                    <section className="my-8">
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                 <div className="text-xs text-gray-500 mb-2 font-medium">关注度趋势图</div>
                                 <img 
                                    src={`https://nocode.meituan.com/photo/search?keyword=line chart,trend,growth&width=400&height=250`} 
                                    className="w-full h-32 object-cover rounded-lg opacity-90"
                                    alt="Trend Chart" 
                                 />
                             </div>
                             <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                 <div className="text-xs text-gray-500 mb-2 font-medium">用户情绪分布</div>
                                 <img 
                                    src={`https://nocode.meituan.com/photo/search?keyword=pie chart,distribution,analytics&width=400&height=250`} 
                                    className="w-full h-32 object-cover rounded-lg opacity-90"
                                    alt="Pie Chart" 
                                 />
                             </div>
                         </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                            关键洞察
                        </h2>
                        <ul className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                        {i}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                                            {i === 1 ? "用户偏好发生结构性转移" : i === 2 ? "细分市场潜力巨大" : "品牌护城河亟待加固"}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {i === 1 ? "从单纯的性价比追求转向了对情感价值和社交属性的重视。" : 
                                             i === 2 ? "在主流市场趋于饱和的情况下，垂直领域的长尾效应开始显现。" : 
                                             "单纯依靠流量红利已不可持续，需要构建基于产品力的核心壁垒。"}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <Separator className="my-8" />
                    
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                             <FileText className="w-5 h-5 text-gray-400" />
                             相关建议
                        </h2>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                            <p className="text-sm text-gray-700">
                                建议立即启动针对该趋势的专项复盘，重点关注<b>供应链响应速度</b>与<b>营销内容的敏捷迭代</b>。同时，可利用现有数据资产训练定制化模型，以提升预测准确率。
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-gray-50">
                    <ThumbsUp className="w-4 h-4" /> 有帮助
                 </Button>
                 <Button variant="outline" size="sm" className="gap-2 bg-white hover:bg-gray-50">
                    <MessageSquare className="w-4 h-4" /> 评论
                 </Button>
            </div>
            <Button 
                onClick={handleStartChat}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
            >
                <ArrowUpRight className="w-4 h-4" />
                和BA Agent接着聊
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
