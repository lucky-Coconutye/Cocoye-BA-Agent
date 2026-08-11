import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AvatarFallback, AvatarImage, Avatar } from '@/components/ui/avatar';
import { Paperclip, Copy, Mic, ArrowLeft, Send, Pencil, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function ChatInterface({ initialMessages, onUpdateMessages, onBack }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const scrollContainerRef = useRef(null);
  const initialSentRef = useRef(false);

  const sendToBackend = async (text) => {
    try {
      const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/v1/chat` : '/api/v1/chat';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId || undefined,
        }),
      });

      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (_) {
        data = {};
      }

      if (!res.ok) {
        const msg = data.detail || data.response || (raw && raw.slice(0, 300)) || res.statusText;
        throw new Error(`(HTTP ${res.status}) ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
      }

      setConversationId(data.conversation_id || conversationId);
      const aiContent = data.response ?? '（无回复内容）';
      setMessages(prev => {
        const next = [...prev, { role: 'ai', content: aiContent }];
        onUpdateMessages?.(next);
        return next;
      });
    } catch (err) {
      const msg = err?.message || '请求失败';
      const hint = msg.includes('500') || msg.includes('502') || msg.toLowerCase().includes('fetch')
        ? ' 请确认后端已启动并可访问 8000 端口。'
        : '';
      setMessages(prev => {
        const next = [...prev, { role: 'ai', content: `请求失败：${msg}${hint}` }];
        onUpdateMessages?.(next);
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 若初始只有一条用户消息，自动触发首轮请求（仅一次）
  useEffect(() => {
    if (messages.length === 1 && messages[0]?.role === 'user' && !initialSentRef.current) {
      initialSentRef.current = true;
      setIsLoading(true);
      sendToBackend(messages[0].content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const newUserMsg = { role: 'user', content: text };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    onUpdateMessages?.(newMessages);
    setInputValue("");
    setIsLoading(true);
    sendToBackend(text);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
       {/* Header */}
       <div className="flex-none flex items-center px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 -ml-2 text-gray-500 hover:text-gray-900">
             <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
             <span className="font-semibold text-gray-900">商业分析助手</span>
             <span className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> 在线
             </span>
          </div>
       </div>

       {/* Chat Area */}
       <div 
         ref={scrollContainerRef}
         className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide pb-4"
       >
          {messages.map((msg, index) => (
            <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
               <div className={`flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[85%] sm:max-w-[75%]`}>
                   {msg.role === 'ai' && (
                     <Avatar className="h-8 w-8 mt-1 shrink-0">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AI</AvatarFallback>
                     </Avatar>
                   )}
                   
                   <div className={`
                      px-5 py-3 text-sm leading-relaxed shadow-sm
                      ${msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'}
                   `}>
                      {msg.content}
                   </div>
               </div>

               {/* Action Buttons */}
               <div className={`flex items-center gap-1 mt-1 ${msg.role === 'user' ? 'mr-1' : 'ml-12'}`}>
                  {msg.role === 'user' ? (
                    // User Actions: Copy, Edit
                    <>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="复制">
                          <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="修改">
                          <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    // AI Actions: Copy, Retry, Like, Dislike (Restored to original)
                    <>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="复制">
                          <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="重试">
                          <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="赞">
                          <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="踩">
                          <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
               </div>
            </motion.div>
          ))}
          
          {isLoading && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3"
             >
                <Avatar className="h-8 w-8 mt-1 shrink-0">
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
             </motion.div>
          )}

       </div>

       {/* Input Area (Changed from absolute to flex-none) */}
       <div className="flex-none bg-white p-4 border-t border-gray-100 z-10">
            <div className="max-w-4xl mx-auto relative">
                <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600 h-9 w-9 rounded-full shrink-0">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input 
                        className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-gray-400 h-10 text-base"
                        placeholder="输入消息..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                     <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600 h-9 w-9 rounded-full shrink-0">
                        <Mic className="h-5 w-5" />
                    </Button>
                    <Button 
                        size="icon" 
                        className="bg-blue-600 hover:bg-blue-700 text-white h-9 w-9 rounded-full ml-1 shrink-0 shadow-sm"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-center mt-2 pb-1">
                     <span className="text-[10px] text-gray-400">AI 生成内容仅供参考</span>
                </div>
            </div>
       </div>
    </div>
  );
}
