'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Process({ data = [] }: { data?: any[] }) {
  const t = useTranslations('PredictPage');
  const [activeIndex, setActiveIndex] = useState(0);

  const renderRightColumn = (index: number) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-body-subtle mt-8">
          <p>Data tidak tersedia untuk analisis.</p>
        </div>
      );
    }

    switch (index) {
      case 0: {
        const calcOutliers = (arr: number[]) => {
          if (arr.length === 0) return 0;
          const sorted = [...arr].sort((a, b) => a - b);
          const q1 = sorted[Math.floor(sorted.length * 0.25)];
          const q3 = sorted[Math.floor(sorted.length * 0.75)];
          const iqr = q3 - q1;
          const lower = q1 - 1.5 * iqr;
          const upper = q3 + 1.5 * iqr;
          return arr.filter(v => v < lower || v > upper).length;
        };
        const outliersV = calcOutliers(data.map(d => Number(d.voltage)));
        const outliersI = calcOutliers(data.map(d => Number(d.current)));
        const outliersP = calcOutliers(data.map(d => Number(d.power_watt)));
        
        return (
          <div className="flex flex-col gap-4 text-left w-full max-w-xl mx-auto mt-4">
            <div className="text-body text-sm space-y-2 mb-2 p-4 bg-neutral-primary rounded-md border border-border-default shadow-xs">
              <p className="font-semibold">Visualisasikan secara detail tentang langkah-langkah IQR, berikut:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tentukan Kuartil 1 (Q₁ atau persentil ke-25) dan Kuartil 3 (Q₃ atau persentil ke-75) dari dataset.</li>
                <li>Hitung jarak antar kuartil (IQR) dengan rumus: <br/><code className="bg-neutral-secondary px-1 py-0.5 rounded text-fg-brand">IQR = Q₃ - Q₁</code></li>
                <li>Tentukan batas bawah dan batas atas untuk menyaring data normal:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Batas Bawah: <code className="bg-neutral-secondary px-1 py-0.5 rounded text-[0.8rem]">Batas Bawah = Q₁ - 1.5 × IQR</code></li>
                    <li>Batas Atas: <code className="bg-neutral-secondary px-1 py-0.5 rounded text-[0.8rem]">Batas Atas = Q₃ + 1.5 × IQR</code></li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <h4 className="font-semibold text-heading text-lg mb-2 text-center lg:text-left">Hasil Deteksi Outlier (Real Data):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-neutral-primary rounded-md border border-border-default shadow-xs">
                <span className="text-body font-medium">Tegangan (V)</span>
                <span className="text-danger font-bold text-xl">{outliersV}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-neutral-primary rounded-md border border-border-default shadow-xs">
                <span className="text-body font-medium">Arus (I)</span>
                <span className="text-danger font-bold text-xl">{outliersI}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-neutral-primary rounded-md border border-border-default shadow-xs">
                <span className="text-body font-medium">Daya Aktif (P)</span>
                <span className="text-danger font-bold text-xl">{outliersP}</span>
              </div>
            </div>
          </div>
        );
      }
      case 1: {
        let smallGaps = 0;
        let largeGaps = 0;
        const sorted = [...data].sort((a, b) => Number(a.last_updated) - Number(b.last_updated));
        for (let i = 1; i < sorted.length; i++) {
          const diff = Number(sorted[i].last_updated) - Number(sorted[i-1].last_updated);
          if (diff > 1800) largeGaps++;
          else if (diff > 60) smallGaps++;
        }
        
        return (
          <div className="flex flex-col gap-4 text-left w-full max-w-xl mx-auto mt-4">
            <div className="text-body text-sm space-y-2 mb-2 p-4 bg-neutral-primary rounded-md border border-border-default shadow-xs">
              <p className="font-semibold">Secara matematis, rumus interpolasi linier untuk mencari data y yang hilang di antara titik (x₁, y₁) dan (x₂, y₂) adalah:</p>
              <p className="text-center font-mono bg-neutral-secondary py-2 rounded text-[0.8rem] text-fg-brand">y = y₁ + (x - x₁)(y₂ - y₁) / (x₂ - x₁)</p>
              <p className="mt-2 font-semibold">Skenario penanganan:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Gap Kecil (&lt; 1 menit):</strong> Diisi menggunakan metode Interpolasi Linier dari nilai sebelum dan sesudah gap.</li>
                <li><strong>Gap Besar (&gt; 30 menit):</strong> Dihapus sebagian besar atau dianalisis terpisah agar tidak merusak model.</li>
              </ul>
            </div>

            <h4 className="font-semibold text-heading text-lg mb-2 text-center lg:text-left">Hasil Analisis Gap (Real Data):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-neutral-primary rounded-md border border-border-default shadow-xs">
                <span className="text-body font-medium">Gap Kecil</span>
                <span className="text-warning font-bold">{smallGaps} gap</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-primary rounded-md border border-border-default shadow-xs">
                <span className="text-body font-medium">Gap Besar</span>
                <span className="text-danger font-bold">{largeGaps} gap</span>
              </div>
            </div>
          </div>
        );
      }
      case 2: {
        const stdV = 220;
        const stdP = 1810;
        const stdI = 9.975;
        
        let errVSum = 0;
        let errISum = 0;
        let errPSum = 0;
        const validLength = data.length > 0 ? data.length : 1;
        
        data.forEach(d => {
           errVSum += Math.abs((Number(d.voltage) - stdV) / stdV) * 100;
           errISum += Math.abs((Number(d.current) - stdI) / stdI) * 100;
           errPSum += Math.abs((Number(d.power_watt) - stdP) / stdP) * 100;
        });
        
        const avgErrV = (errVSum / validLength).toFixed(2);
        const avgErrI = (errISum / validLength).toFixed(2);
        const avgErrP = (errPSum / validLength).toFixed(2);

        return (
          <div className="flex flex-col gap-4 text-left w-full max-w-xl mx-auto mt-4">
            <div className="text-body text-sm space-y-2 mb-2 p-4 bg-neutral-primary rounded-md border border-border-default shadow-xs">
              <p className="font-semibold">Rumus untuk menghitung simpangan persentase (Error):</p>
              <p className="text-center font-mono bg-neutral-secondary py-2 rounded text-[0.8rem] text-fg-brand">Error(%) = |(Nilai Sensor - Nilai Standar) / Nilai Standar| × 100%</p>
              <p className="mt-2 font-semibold">Nilai Alat Standar tetap:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tegangan: 220V</li>
                <li>Daya Aktif: 1810 Watt</li>
                <li>Arus: 8.35A - 11.6A (Rata-rata: 9.975A)</li>
              </ul>
            </div>

            <h4 className="font-semibold text-heading text-lg mb-2 text-center lg:text-left">Rata-rata Error Real Data:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-neutral-primary rounded-md border border-border-default shadow-xs">
                <span className="text-body font-medium">Error V</span>
                <span className="text-brand font-bold text-xl">{avgErrV}%</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-neutral-primary rounded-md border border-border-default shadow-xs">
                <span className="text-body font-medium">Error I</span>
                <span className="text-brand font-bold text-xl">{avgErrI}%</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-neutral-primary rounded-md border border-border-default shadow-xs">
                <span className="text-body font-medium">Error P</span>
                <span className="text-brand font-bold text-xl">{avgErrP}%</span>
              </div>
            </div>
          </div>
        );
      }
      case 3: {
        const anomalousRows = [];
        for (let i = 1; i < data.length; i++) {
           const prev = Number(data[i-1].last_updated);
           const curr = Number(data[i].last_updated);
           if (curr <= prev) {
             anomalousRows.push({ current: data[i], prev: data[i-1] });
           }
        }
        return (
          <div className="flex flex-col gap-4 text-left w-full max-w-xl mx-auto mt-4">
            <h4 className="font-semibold text-heading text-lg mb-2 text-center lg:text-left">Daftar Data Anomali Temporal:</h4>
            {anomalousRows.length === 0 ? (
              <div className="p-4 bg-success-soft rounded-md border border-success text-success text-center">
                <p className="font-medium">Tidak ada anomali temporal (Semua data berurutan dengan benar).</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-border-default rounded-md max-h-[16rem] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-body uppercase bg-neutral-secondary sticky top-0">
                    <tr>
                      <th className="px-4 py-3">ID Baris (Prev)</th>
                      <th className="px-4 py-3">ID Baris (Curr)</th>
                      <th className="px-4 py-3">Waktu (Prev)</th>
                      <th className="px-4 py-3">Waktu (Curr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anomalousRows.slice(0, 50).map((row, idx) => (
                      <tr key={idx} className="bg-neutral-primary border-b border-border-default">
                        <td className="px-4 py-2 text-body">{row.prev.id.substring(0,8)}...</td>
                        <td className="px-4 py-2 text-body">{row.current.id.substring(0,8)}...</td>
                        <td className="px-4 py-2 text-danger">{row.prev.last_updated}</td>
                        <td className="px-4 py-2 text-danger">{row.current.last_updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      }
      case 4: {
        const zeroData = data.filter(d => Number(d.power_watt) <= 0 || Number(d.current) <= 0);
        return (
          <div className="flex flex-col gap-4 text-left w-full max-w-xl mx-auto mt-4">
            <h4 className="font-semibold text-heading text-lg mb-2 text-center lg:text-left">Daftar Data dengan P atau I = 0:</h4>
            {zeroData.length === 0 ? (
              <div className="p-4 bg-success-soft rounded-md border border-success text-success text-center">
                <p className="font-medium">Tidak ada data dengan nilai P atau I nol/negatif.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-border-default rounded-md max-h-[16rem] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-body uppercase bg-neutral-secondary sticky top-0">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Tegangan (V)</th>
                      <th className="px-4 py-3">Arus (I)</th>
                      <th className="px-4 py-3">Daya (P)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zeroData.slice(0, 50).map((row, idx) => (
                      <tr key={idx} className="bg-neutral-primary border-b border-border-default">
                        <td className="px-4 py-2 text-body">{row.id.substring(0,8)}...</td>
                        <td className="px-4 py-2 text-body">{row.voltage}</td>
                        <td className="px-4 py-2 text-danger">{row.current}</td>
                        <td className="px-4 py-2 text-danger">{row.power_watt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      }
      case 5: {
        const total = data.length;
        const trainCount = Math.floor(total * 0.7);
        const trainData = data.slice(0, trainCount);
        const testData = data.slice(trainCount);
        
        return (
          <div className="flex flex-col xl:flex-row gap-6 text-left w-full max-w-4xl mx-auto mt-4">
            <div className="flex-1">
              <h4 className="font-semibold text-heading text-lg mb-2 flex justify-between">
                <span>Data Latih (70%)</span>
                <span className="text-brand text-sm">{trainCount} baris</span>
              </h4>
              <div className="overflow-x-auto border border-brand/20 rounded-md max-h-[14rem] overflow-y-auto shadow-xs">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-body uppercase bg-brand-soft text-brand sticky top-0">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">V</th>
                      <th className="px-3 py-2">I</th>
                      <th className="px-3 py-2">P</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="bg-neutral-primary border-b border-border-default hover:bg-neutral-secondary">
                        <td className="px-3 py-2 text-body-subtle">{row.id.substring(0,6)}</td>
                        <td className="px-3 py-2 text-body">{row.voltage}</td>
                        <td className="px-3 py-2 text-body">{row.current}</td>
                        <td className="px-3 py-2 text-body">{row.power_watt}</td>
                      </tr>
                    ))}
                    {trainData.length > 10 && (
                      <tr className="bg-neutral-secondary text-center text-body-subtle">
                         <td colSpan={4} className="py-2">... {trainData.length - 10} data lainnya</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-heading text-lg mb-2 flex justify-between">
                <span>Data Uji (30%)</span>
                <span className="text-success text-sm">{testData.length} baris</span>
              </h4>
              <div className="overflow-x-auto border border-success/20 rounded-md max-h-[14rem] overflow-y-auto shadow-xs">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-body uppercase bg-success-soft text-success sticky top-0">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">V</th>
                      <th className="px-3 py-2">I</th>
                      <th className="px-3 py-2">P</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="bg-neutral-primary border-b border-border-default hover:bg-neutral-secondary">
                        <td className="px-3 py-2 text-body-subtle">{row.id.substring(0,6)}</td>
                        <td className="px-3 py-2 text-body">{row.voltage}</td>
                        <td className="px-3 py-2 text-body">{row.current}</td>
                        <td className="px-3 py-2 text-body">{row.power_watt}</td>
                      </tr>
                    ))}
                    {testData.length > 10 && (
                      <tr className="bg-neutral-secondary text-center text-body-subtle">
                         <td colSpan={4} className="py-2">... {testData.length - 10} data lainnya</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const steps = [
    {
      label: "Deteksi Outlier",
      question: "Deteksi dan Penghapusan Pencilan (Outlier)",
      answer: (
        <div className="space-y-2">
          <p>Data outlier adalah nilai yang menyimpang sangat jauh dari pola normal. Penulis menggunakan metode <strong>Interquartile Range (IQR)</strong> pada variabel Arus (I), Tegangan (V), dan Daya Aktif (P) untuk mendeteksinya.</p>
          <p className="font-semibold mt-4">Langkah-langkah IQR:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Tentukan Kuartil 1 (Q₁) dan Kuartil 3 (Q₃) dari dataset.</li>
            <li>Hitung IQR: <code className="bg-neutral-secondary px-1 py-0.5 rounded text-fg-brand">IQR = Q₃ - Q₁</code></li>
            <li>Tentukan batas penyaringan:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><code className="bg-neutral-secondary px-1 py-0.5 rounded">Batas Bawah = Q₁ - 1.5 × IQR</code></li>
                <li><code className="bg-neutral-secondary px-1 py-0.5 rounded">Batas Atas = Q₃ + 1.5 × IQR</code></li>
              </ul>
            </li>
            <li><strong>Tindakan:</strong> Jika ada data di luar batas, data tersebut ditandai atau dihapus.</li>
          </ol>
        </div>
      )
    },
    {
      label: "Missing Data",
      question: "Penanganan Data yang Hilang",
      answer: (
        <div className="space-y-2">
          <p>Karena sistem mengirimkan data menggunakan Wi-Fi, terkadang ada gap (kekosongan). Skenario penanganan:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Gap Kecil (&lt; 1 menit):</strong> Diisi menggunakan <strong>Interpolasi Linier</strong>.<br />
            <em className="text-body-subtle mt-1 block">(Rumus interpolasi: <code className="bg-neutral-secondary px-1 py-0.5 rounded font-mono text-[0.8em]">y = y₁ + (x - x₁)(y₂ - y₁) / (x₂ - x₁)</code>)</em></li>
            <li><strong>Gap Besar (&gt; 30 menit):</strong> Interpolasi tidak lagi akurat. Data pada periode ini dihapus atau dianalisis terpisah.</li>
          </ul>
        </div>
      )
    },
    {
      label: "Ground Truth",
      question: "Validasi terhadap Ground Truth",
      answer: (
        <div className="space-y-2">
          <p>Pembacaan sensor di-cross check dengan alat ukur standar (multimeter/clamp meter) untuk memastikan kalibrasinya tidak bergeser (drift).</p>
          <p className="font-semibold">Menghitung simpangan persentase:</p>
          <p><code className="bg-neutral-secondary px-1 py-0.5 rounded text-fg-brand">Error(%) = |(Sensor - Standar) / Standar| × 100%</code></p>
          <p><strong>Tindakan:</strong> Jika Error &gt; 5%, data ditandai untuk investigasi / kalibrasi ulang.</p>
        </div>
      )
    },
    {
      label: "Konsistensi Waktu",
      question: "Pengecekan Konsistensi Waktu",
      answer: (
        <div className="space-y-2">
          <p>Karena regresi ini berbasis time-series, urutan waktu pengambilan data sangat krusial.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Syarat Mutlak:</strong> Timestamp harus terus meningkat.</li>
            <li><strong>Tindakan:</strong> Tidak boleh ada waktu berduplikasi atau mundur. Jika ditemukan anomali temporal (sistem restart), data dibuang.</li>
          </ul>
        </div>
      )
    },
    {
      label: "Sanity Check",
      question: "Pengecekan Kewajaran Logis",
      answer: (
        <div className="space-y-2">
          <p>Verifikasi logika dasar kelistrikan pada hasil Daya Aktif (P).</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Daya aktif (P) <strong>tidak boleh negatif</strong>.</li>
            <li>Jika arus 0 (AC mati), maka Daya Aktif (P) harus 0.</li>
            <li><strong>Tindakan:</strong> Pelanggaran terhadap logika ini akan membuat baris data tersebut dihapus.</li>
          </ul>
        </div>
      )
    },
    {
      label: "Data Splitting",
      question: "Pembagian Data (Time-Based Split)",
      answer: (
        <div className="space-y-2">
          <p>Setelah dataset bersih, dilakukan pembagian menggunakan metode <strong>Time-Based Split</strong> (bukan random).</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>70% data awal (kronologis)</strong> menjadi Data Latih (Training Set).</li>
            <li><strong>30% data terbaru</strong> menjadi Data Uji (Testing Set).</li>
            <li>Metode ini realistis untuk mensimulasikan pemodelan masa depan berdasarkan masa lalu.</li>
          </ul>
        </div>
      )
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-neutral-primary-soft">
      <div className="w-full overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 custom-scrollbar">
        {/* Widget shell: Fixed 1024x640 Canvas */}
        <div className="w-[1024px] h-[640px] shrink-0 mx-auto flex flex-col p-[40px] rounded-[20px] bg-neutral-primary shadow-xl border border-border-default overflow-hidden">
          
          {/* Header row */}
          <div className="flex-none">
            <h2 className="text-[24px] font-semibold text-body-subtle">
              {t('title')}
            </h2>
          </div>

          {/* Stepper track */}
          <div className="flex-none mt-[24px]">
            <div className="w-full h-[64px] rounded-full bg-neutral-secondary-soft flex items-center px-2 border border-border-default">
              {steps.map((step, idx) => {
                const isActive = idx === activeIndex;
                const isCompleted = idx < activeIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className="flex-1 flex items-center gap-2 px-2 hover:bg-neutral-primary/50 h-full transition-colors group first:rounded-l-full last:rounded-r-full"
                  >
                    <div className={`w-[24px] h-[24px] shrink-0 rounded-full flex items-center justify-center text-[12px] font-medium transition-colors ${
                      isActive ? 'bg-brand text-white border-transparent shadow-xs' :
                      isCompleted ? 'bg-success text-white border-transparent' :
                      'border border-border-default text-body-subtle bg-neutral-primary'
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3" /> : (idx + 1)}
                    </div>
                    <span className={`text-[13px] font-medium truncate ${isActive ? 'text-heading' : 'text-body-subtle group-hover:text-body'}`}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Success state (Body Content) */}
          <div className="flex-1 mt-[48px] overflow-y-auto pr-4 custom-scrollbar">
            <div className="flex flex-row gap-8 h-full">
              
              {/* Left Column: Rules & Description */}
              <div className="w-1/3 flex flex-col items-start shrink-0 pt-2">
                 <div className="text-body text-sm leading-relaxed w-full">
                   {steps[activeIndex].answer}
                 </div>
              </div>

              {/* Right Column: Real Data Analytics */}
              <div className="w-2/3 flex flex-col justify-start items-center bg-neutral-secondary-soft rounded-base border border-border-default p-6 min-h-max">
                 <p className="text-[20px] text-heading font-medium text-center mb-4">
                   {steps[activeIndex].question}
                 </p>
                 <div className="w-full">
                   {renderRightColumn(activeIndex)}
                 </div>
              </div>

            </div>
          </div>

          {/* Footer row */}
          <div className="flex-none mt-[32px] pt-[24px] flex justify-between items-center border-t border-border-default">
            <Button 
              variant="outline" 
              onClick={handlePrev}
              aria-label="Previous step"
              className="w-[140px] shadow-none"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Sebelumnya
            </Button>
            <Button 
              variant="outline" 
              onClick={handleNext}
              aria-label="Next step"
              className="w-[140px] shadow-none"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
