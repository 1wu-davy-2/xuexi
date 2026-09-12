import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface OutputValue {
  /** 弹出系统打印对话框，内容为给定的 React 节点 */
  print: (node: React.ReactNode) => void;
  /** 将节点渲染为 A4 宽度文档并下载为 PDF（多页自动切分） */
  exportPdf: (node: React.ReactNode, filename: string) => Promise<void>;
  busy: boolean;
}

const OutputCtx = createContext<OutputValue | null>(null);

const PAGE_W = 210; // mm, A4
const PAGE_H = 297;
const MARGIN = 8;
const CONTENT_W = PAGE_W - MARGIN * 2;
const CONTENT_H = PAGE_H - MARGIN * 2;

export function OutputProvider({ children }: { children: React.ReactNode }) {
  const [printNode, setPrintNode] = useState<React.ReactNode>(null);
  const [pdfNode, setPdfNode] = useState<React.ReactNode>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  // 打印流程：挂载内容 → 等渲染 → 调起打印 → 打印结束卸载
  useEffect(() => {
    if (!printNode) return;
    const after = () => setPrintNode(null);
    window.addEventListener('afterprint', after);
    const t = window.setTimeout(() => window.print(), 180);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('afterprint', after);
    };
  }, [printNode]);

  const print = useCallback((node: React.ReactNode) => setPrintNode(node), []);

  const exportPdf = useCallback(async (node: React.ReactNode, filename: string) => {
    setPdfNode(node);
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 350));
      const el = pdfRef.current;
      if (!el || el.children.length === 0) throw new Error('导出内容未渲染');
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const rect = el.getBoundingClientRect();
      if (rect.height < 10) throw new Error('导出内容高度异常');
      // 限制画布总高，避免超长文档超出浏览器画布上限
      const scale = Math.min(2, Math.max(1, 14000 / Math.max(1, rect.height)));
      const canvas = await html2canvas(el, {
        scale,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        windowWidth: 900,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
      const imgW = CONTENT_W;
      const imgH = (canvas.height / canvas.width) * imgW;
      pdf.addImage(imgData, 'JPEG', MARGIN, MARGIN, imgW, imgH);
      let remaining = imgH - CONTENT_H;
      let offset = 0;
      while (remaining > 0) {
        offset += CONTENT_H;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', MARGIN, MARGIN - offset, imgW, imgH);
        remaining -= CONTENT_H;
      }
      pdf.save(filename);
    } catch (e) {
      console.error('PDF 导出失败', e);
      alert('PDF 导出失败，可改用「打印」→ 目标打印机选「另存为 PDF」。');
    } finally {
      setPdfNode(null);
      setBusy(false);
    }
  }, []);

  return (
    <OutputCtx.Provider value={{ print, exportPdf, busy }}>
      {children}
      {createPortal(<div id="print-root">{printNode}</div>, document.body)}
      {createPortal(
        <div id="pdf-export-root" ref={pdfRef} aria-hidden>
          {pdfNode}
        </div>,
        document.body,
      )}
    </OutputCtx.Provider>
  );
}

export function useOutput(): OutputValue {
  const v = useContext(OutputCtx);
  if (!v) throw new Error('useOutput 必须在 OutputProvider 内使用');
  return v;
}

/** 打印/PDF 文档通用页眉 */
export function DocHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <>
      <h1>{title}</h1>
      <div className="print-sub">
        {sub ? sub + ' · ' : ''}
        成考冲刺复习系统 · 生成于 {new Date().toLocaleString('zh-CN')}
      </div>
    </>
  );
}
