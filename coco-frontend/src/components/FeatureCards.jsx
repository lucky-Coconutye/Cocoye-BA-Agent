import { CardContent, Card } from '@/components/ui/card';
import { FileSpreadsheet, PieChart, ChevronUp, ArrowRight, FilePenLine } from 'lucide-react';
import React from 'react';

const CardItem = ({ title, desc, imageKeyword, icon: Icon }) => (
  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl cursor-pointer w-full h-40 flex-shrink-0 relative">
    <CardContent className="p-0 relative h-full">
       <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 group-hover:scale-105 transition-transform duration-500">
          <img 
            src={`https://nocode.meituan.com/photo/search?keyword=${imageKeyword},minimalist,white background,high quality&width=600&height=300`} 
            alt={title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
       </div>
       
       <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
          <div>
            {Icon && (
                <div className="mb-3 flex items-center justify-center w-8 h-8 rounded-full bg-[#4A4A4A] text-white shadow-sm backdrop-blur-sm border border-white/10">
                    <Icon className="w-4 h-4" />
                </div>
            )}
            <h3 className="text-base font-semibold text-gray-900 leading-tight mb-1.5">
                <span className="bg-white/60 backdrop-blur-[2px] px-1 rounded box-decoration-clone">
                {title}
                </span>
            </h3>
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                 <span className="bg-white/60 backdrop-blur-[2px] px-1 rounded box-decoration-clone">
                {desc}
                </span>
            </p>
          </div>
          
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 p-2 rounded-full shadow-sm">
                <ArrowRight className="h-4 w-4 text-gray-700" />
            </div>
          </div>
       </div>
    </CardContent>
  </Card>
);

export function FeatureCards({ onMoreClick }) {
  return (
    // 修改：将最大宽度调整为 max-w-5xl (1024px)，并将水平 padding 调整为 px-4
    // 这样可以与上方的输入框区域（ChatInputArea）保持宽度和对齐方式的一致
    <div className="w-full max-w-5xl mx-auto mt-6 px-4">
        <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-sm font-medium text-gray-500">精选案例</h2>
             <span 
                className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 flex items-center"
                onClick={onMoreClick}
             >
                更多 <ChevronUp className="ml-1 h-3 w-3" />
             </span>
        </div>
       
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardItem 
            title="季度财报数据清洗" 
            desc="自动处理复杂 Excel 表格，识别异常值并生成透视分析"
            imageKeyword="abstract data grid,clean technology"
            icon={FileSpreadsheet}
        />
        <CardItem 
            title="销售趋势可视化" 
            desc="将原始数据一键转化为专业的组合图表，清晰展示增长趋势"
            imageKeyword="minimalist chart,abstract analytics"
            icon={PieChart}
        />
        <CardItem 
            title="商业计划书润色" 
            desc="优化文档逻辑与措辞，提升专业度，自动生成摘要"
            imageKeyword="minimalist workspace,clean desk"
            icon={FilePenLine}
        />
      </div>
    </div>
  );
}
