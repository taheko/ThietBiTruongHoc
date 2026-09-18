import { useState, useMemo } from 'react';
import {
  Sparkles,
  ClipboardList,
  FileBarChart,
  TrendingDown,
  Trash2,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import {
  generateReport,
  REPORT_TYPE_LABELS,
  type AIReportInput,
} from '@/lib/ai-engine';
import type { AIReportType, AIReport } from '@/types/database';

const REPORT_CARDS: {
  type: AIReportType;
  label: string;
  description: string;
  icon: typeof FileText;
  color: string;
}[] = [
  {
    type: 'inventory_report',
    label: 'Báo cáo kiểm kê',
    description: 'Sinh từ dữ liệu một đợt kiểm kê: tài sản thiếu, hỏng, cần sửa và đề xuất xử lý.',
    icon: ClipboardList,
    color: 'bg-primary-50 text-primary-600 border-primary-200',
  },
  {
    type: 'condition_summary',
    label: 'Tóm tắt tình trạng',
    description: 'Tóm tắt tình trạng tài sản theo từng phòng ban với chỉ số sức khỏe tài sản.',
    icon: FileBarChart,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    type: 'replacement_suggestions',
    label: 'Gợi ý thay thế',
    description: 'Dựa trên tình trạng và lịch sử sửa chữa, đề xuất danh sách tài sản cần sửa chữa hoặc thay thế.',
    icon: TrendingDown,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
];

// Hàm chuyển Markdown sang HTML theo Bảng 81 (hienThiMarkdown)
function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let isHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Dòng bảng | ... |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Kiểm tra dòng separator |---|---|
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        isHeader = false;
        continue;
      }

      if (!inTable) {
        inTable = true;
        isHeader = true;
        html += '<div class="overflow-x-auto my-3"><table class="w-full text-left text-sm border-collapse border border-slate-200">';
        html += '<thead class="bg-slate-100"><tr>';
        cells.forEach((c) => {
          html += `<th class="border border-slate-200 px-3 py-2 font-semibold text-slate-700">${c}</th>`;
        });
        html += '</tr></thead><tbody>';
        continue;
      }

      if (isHeader) {
        html += '<tr class="bg-slate-50">';
        cells.forEach((c) => {
          html += `<th class="border border-slate-200 px-3 py-2 font-semibold text-slate-700">${c}</th>`;
        });
        html += '</tr>';
        continue;
      }

      html += '<tr class="hover:bg-slate-50">';
      cells.forEach((c) => {
        let content = c.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `<td class="border border-slate-200 px-3 py-2 text-slate-700">${content}</td>`;
      });
      html += '</tr>';
      continue;
    }

    if (inTable) {
      html += '</tbody></table></div>';
      inTable = false;
      isHeader = false;
    }

    // Tiêu đề #, ##, ###
    if (trimmed.startsWith('# ')) {
      html += `<h1 class="text-xl font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-200">${trimmed.slice(2)}</h1>`;
    } else if (trimmed.startsWith('## ')) {
      html += `<h2 class="text-lg font-bold text-slate-800 mt-4 mb-2">${trimmed.slice(3)}</h2>`;
    } else if (trimmed.startsWith('### ')) {
      html += `<h3 class="text-base font-semibold text-slate-800 mt-3 mb-1">${trimmed.slice(4)}</h3>`;
    } else if (trimmed === '---') {
      html += '<hr class="my-4 border-slate-200" />';
    } else if (trimmed.startsWith('- ')) {
      let content = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `<li class="ml-4 list-disc text-sm text-slate-700 my-1">${content}</li>`;
    } else if (trimmed === '') {
      html += '<div class="h-2"></div>';
    } else {
      let content = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<p class="text-sm text-slate-700 my-1 leading-relaxed">${content}</p>`;
    }
  }

  if (inTable) {
    html += '</tbody></table></div>';
  }

  return html;
}

export function AIReportsPage() {
  const { assets, categories, locations, sessions, inventoryItems, repairs, disposals, aiReports, reload, loading } = useData();

  const [selectedType, setSelectedType] = useState<AIReportType>('inventory_report');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<{ id?: string; title: string; content: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Danh sách báo cáo đã lưu sắp xếp mới nhất trước
  const savedReports = useMemo(() => {
    return [...aiReports].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [aiReports]);

  // Sinh báo cáo AI theo UC014
  const handleGenerateReport = async () => {
    setError(null);

    // Kiểm tra đợt kiểm kê nếu chọn Báo cáo kiểm kê (TC_40)
    if (selectedType === 'inventory_report' && !selectedSessionId) {
      setError('Vui lòng chọn đợt kiểm kê để sinh báo cáo.');
      return;
    }

    setGenerating(true);

    try {
      const input: AIReportInput = {
        assets,
        categories,
        locations,
        sessions,
        inventoryItems,
        repairs,
        disposals,
        sessionId: selectedSessionId || undefined,
      };

      const content = generateReport(selectedType, input);

      let title = REPORT_TYPE_LABELS[selectedType];
      if (selectedType === 'inventory_report') {
        const s = sessions.find((item) => item.id === selectedSessionId);
        title = `Báo cáo kiểm kê: ${s?.title || s?.name || 'Đợt kiểm kê'}`;
      } else if (selectedType === 'condition_summary') {
        title = 'Tóm tắt tình trạng tài sản theo phòng ban';
      } else if (selectedType === 'replacement_suggestions') {
        title = 'Gợi ý danh sách tài sản cần sửa chữa hoặc thay thế';
      }

      // Tự động lưu vào bảng ai_reports theo UC014
      const { data: savedData, error: saveError } = await supabase
        .from('ai_reports')
        .insert({
          type: selectedType,
          title,
          content,
          source_data: {
            session_id: selectedSessionId || null,
            asset_count: assets.length,
            generated_at: new Date().toISOString(),
          },
        })
        .select()
        .single();

      if (saveError) {
        console.warn('Lỗi lưu báo cáo vào Supabase:', saveError.message);
      }

      setCurrentReport({
        id: savedData?.id,
        title,
        content,
      });

      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi sinh báo cáo');
    } finally {
      setGenerating(false);
    }
  };

  // Xem lại báo cáo đã lưu (UC015, TC_45)
  const handleSelectSavedReport = (report: AIReport) => {
    setError(null);
    setCurrentReport({
      id: report.id,
      title: report.title,
      content: report.content,
    });
  };

  // Xóa báo cáo đã lưu (UC015, TC_46)
  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm('Xóa báo cáo này?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('ai_reports')
        .delete()
        .eq('id', reportId);

      if (deleteError) throw deleteError;

      // Nếu đang xem đúng báo cáo bị xóa thì ẩn đi
      if (currentReport?.id === reportId) {
        setCurrentReport(null);
      }

      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa báo cáo');
    }
  };

  // Tải báo cáo dạng file .md
  const handleDownload = () => {
    if (!currentReport) return;
    const blob = new Blob([currentReport.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentReport.title.replace(/[:\/\\?*]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">AI Báo cáo</h2>
        <p className="text-sm text-slate-500">
          Tự động phân tích dữ liệu, tổng hợp tình trạng và đề xuất xử lý thiết bị
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3 Thẻ chọn loại báo cáo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {REPORT_CARDS.map((card) => {
          const Icon = card.icon;
          const selected = selectedType === card.type;
          return (
            <button
              key={card.type}
              type="button"
              onClick={() => {
                setSelectedType(card.type);
                setError(null);
              }}
              className={`card flex flex-col justify-between p-5 text-left transition-all ${
                selected
                  ? 'border-2 border-primary-600 ring-2 ring-primary-100 shadow-md'
                  : 'hover:border-slate-300'
              }`}
            >
              <div>
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{card.label}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary-600">
                <span className={`h-2 w-2 rounded-full ${selected ? 'bg-primary-600' : 'bg-slate-300'}`} />
                {selected ? 'Đang chọn' : 'Chọn loại này'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tùy chọn sinh báo cáo */}
      <div className="card p-5 space-y-4">
        {selectedType === 'inventory_report' && (
          <div>
            <label className="label">Chọn đợt kiểm kê *</label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="input sm:max-w-md"
            >
              <option value="">— Chọn đợt kiểm kê —</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title || s.name} ({s.start_date})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={generating}
            className="btn-primary"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? 'Đang sinh báo cáo...' : 'Sinh báo cáo AI'}
          </button>
        </div>
      </div>

      {/* Khung hiển thị nội dung báo cáo (kèm nhãn Đã lưu) */}
      {currentReport && (
        <div className="card p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900">{currentReport.title}</h3>
              {/* Nhãn "Đã lưu" theo đúng UC014 và TC_41 */}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Đã lưu
              </span>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="h-3.5 w-3.5" />
              Tải tệp Markdown
            </button>
          </div>

          <div
            className="prose prose-slate max-w-none text-slate-800"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(currentReport.content) }}
          />
        </div>
      )}

      {/* Danh sách Báo cáo đã lưu (n) theo UC015 */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
          Báo cáo đã lưu ({savedReports.length})
        </h3>

        {savedReports.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            Chưa có báo cáo nào được lưu.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {savedReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-lg transition"
              >
                <button
                  type="button"
                  onClick={() => handleSelectSavedReport(report)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-sm font-semibold text-slate-800 truncate hover:text-primary-600">
                    {report.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(report.created_at).toLocaleString('vi-VN')}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReport(report.id)}
                  title="Xóa báo cáo"
                  className="rounded p-1.5 text-slate-400 hover:bg-error-50 hover:text-error-600 transition ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
