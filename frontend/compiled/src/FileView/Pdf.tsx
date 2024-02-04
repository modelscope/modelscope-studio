import React, { useEffect, useRef, useState } from 'react';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';

import { isMobile } from '../utils';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://g.alicdn.com/code/lib/pdf.js/3.11.174/pdf.worker.min.js';

// let registered = false;

// async function importWorker() {
//   if (registered) {
//     return;
//   }
//   // @ts-ignore worker
//   const pdfWorker = (await import('pdfjs-dist/build/pdf.worker.min.js'))
//     .default;
//   const workerBlob = new Blob([pdfWorker], {
//     type: 'application/javascript',
//   });
//   const workerUrl = URL.createObjectURL(workerBlob);
//   pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
//   registered = true;
// }

export interface PdfProps {
  src?: string;
  width?: number;
  height?: number;
}

export const Pdf: React.FC<PdfProps> = ({ src, height, width = '100%' }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const lastWidthRef = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  function renderPdf() {
    // Render a specific page of the PDF onto the canvas
    pdfDoc?.getPage(currentPage).then((page) => {
      renderTaskRef?.current?.cancel();
      const el = canvasRef.current;
      const container = canvasContainerRef.current;
      const ctx = el?.getContext('2d');
      if (!container || !el || !ctx) {
        return;
      }
      const maxWidth = container.getBoundingClientRect().width;
      ctx.clearRect(0, 0, el.width, el.height);
      let viewport = page.getViewport({ scale: 1 });
      const maxScale = maxWidth / viewport.width;
      let scale = maxScale;
      if (height) {
        scale = Math.min(height / viewport.height, maxScale);
      } else {
        // pc
        if (!isMobile()) {
          scale = maxScale * 0.6;
        }
        container.style.height = `${viewport.height * scale}px`;
      }

      viewport = page.getViewport({ scale: scale });

      const renderContext = {
        canvasContext: ctx,
        viewport,
      };
      el.width = viewport.width;
      el.height = viewport.height;
      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      renderTask.promise.catch(() => {
        // cancel error
      });
    });
  }
  async function getPdfDoc() {
    if (!src) {
      return;
    }
    pdfDoc?.destroy();
    const loadingTask = pdfjsLib.getDocument(src);
    const doc = await loadingTask.promise;
    setCurrentPage(1);
    setTotalPage(doc.numPages);
    setPdfDoc(doc);
  }

  useEffect(() => {
    getPdfDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) {
      return;
    }
    lastWidthRef.current = el.getBoundingClientRect().width;
    let timeout: number | null = null;
    // listen el width changed
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const rect = entry.contentRect;
      if (rect.width !== lastWidthRef.current) {
        timeout && clearTimeout(timeout);
        lastWidthRef.current = rect.width;
        timeout = setTimeout(() => {
          renderPdf();
        }, 500) as unknown as number;
      }
    });
    resizeObserver.observe(el);
    renderPdf();
    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, currentPage, totalPage]);

  return (
    <>
      {!!totalPage && (
        <div className="ms-file-view-pdf">
          <div
            ref={canvasContainerRef}
            className="ms-file-view-pdf-canvas"
            style={{
              width,
              height,
            }}
          >
            <canvas ref={canvasRef} />
          </div>
          <div className="ms-file-view-pdf-button-row">
            <Button
              icon={<CaretLeftOutlined />}
              disabled={currentPage <= 1}
              onClick={() => {
                if (currentPage <= 1) {
                  return;
                }
                setCurrentPage(currentPage - 1);
                renderPdf();
              }}
            />
            <span className="ms-file-view-pdf-page-count">
              {currentPage} / {totalPage}
            </span>
            <Button
              disabled={currentPage >= totalPage}
              icon={<CaretRightOutlined />}
              onClick={() => {
                if (currentPage >= totalPage) {
                  return;
                }
                setCurrentPage(currentPage + 1);
                renderPdf();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Pdf;
