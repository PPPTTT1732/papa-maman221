import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';

interface Props {
  readonly profName: string;
}

export function ProfessorScannerTab({ profName }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isScanning && !scanSuccess) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanSuccess(true);
            setIsScanning(false);
            return 100;
          }
          return prev + 10;
        });
      }, 120);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, scanSuccess]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanSuccess(false);
    setProgress(0);
  };

  const handleReset = () => {
    setIsScanning(false);
    setScanSuccess(false);
    setProgress(0);
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-[10.5px] text-neutral-500 leading-relaxed font-semibold">
        Ouvrez votre caméra pour scanner le QR Code du vigile afin d'enregistrer votre présence.
      </p>

      {scanSuccess ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex flex-col items-center gap-2"
        >
          <div className="h-10 w-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm">
            <Icon icon="lucide:check-circle" className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-emerald-900">Présence Validée !</h4>
            <p className="text-[10px] text-emerald-700 font-medium max-w-[240px]">
              Votre badge a été scanné avec succès par le vigile d&apos;ÉCOLE 221. Session enregistrée.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="mt-1 px-3 py-1 bg-white hover:bg-emerald-100/50 border border-emerald-200/50 text-emerald-800 rounded-lg text-[9px] font-black transition-colors cursor-pointer"
          >
            Scanner à nouveau
          </button>
        </motion.div>
      ) : isScanning ? (
        <div className="space-y-3">
          {/* Viewfinder Simulator */}
          <div className="relative aspect-square w-48 mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col items-center justify-center text-white">
            {/* Viewfinder Corner brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-brand-red-deep" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-brand-red-deep" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-brand-red-deep" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-brand-red-deep" />

            {/* Pulsing QR Target */}
            <div className="w-24 h-24 opacity-30 animate-pulse bg-white/10 rounded-xl flex items-center justify-center border border-white/25">
              <Icon icon="lucide:qr-code" className="h-16 w-16 text-white" />
            </div>

            {/* Scanning Laser Line */}
            <motion.div 
              animate={{ y: [0, 160, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute left-3 right-3 h-0.5 bg-brand-red-deep opacity-80 shadow-[0_0_8px_#B3181C]"
            />

            <span className="absolute bottom-4 text-[9px] font-black tracking-widest text-neutral-400 animate-pulse uppercase">
              Caméra active...
            </span>
          </div>

          {/* Progress bar */}
          <div className="max-w-[200px] mx-auto space-y-1">
            <div className="flex justify-between text-[8px] font-black text-neutral-400 uppercase tracking-wider">
              <span>Lecture du code</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/20">
              <div className="h-full bg-brand-red-deep transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="aspect-square w-48 mx-auto rounded-2xl bg-neutral-50 border border-neutral-200/60 flex flex-col items-center justify-center p-4 shadow-3xs relative group">
            <div className="h-12 w-12 bg-[#B3181C]/5 text-[#B3181C] rounded-full flex items-center justify-center border border-[#B3181C]/10 mb-2">
              <Icon icon="lucide:camera" className="h-6 w-6 stroke-[2]" />
            </div>
            <p className="text-[10px] text-neutral-400 font-bold leading-normal max-w-[140px]">
              La caméra de votre appareil sera activée pour filmer le code du vigile.
            </p>
          </div>

          <button
            onClick={handleStartScan}
            className="w-full py-2.5 bg-brand-red-deep hover:bg-[#961215] text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
          >
            <Icon icon="lucide:camera" className="h-4 w-4" />
            Activer l&apos;Appareil Photo
          </button>
        </div>
      )}
    </div>
  );
}
