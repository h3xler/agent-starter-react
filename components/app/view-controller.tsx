'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useSessionContext, useRemoteParticipants } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { SessionView } from '@/components/app/session-view';
import { WelcomeView } from '@/components/app/welcome-view';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionSessionView = motion.create(SessionView);

const VIEW_MOTION_PROPS = {
  variants: {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: { duration: 0.5, ease: 'linear' },
};

interface ViewControllerProps {
  appConfig: AppConfig;
}

export function ViewController({ appConfig }: ViewControllerProps) {
  const { isConnected, start } = useSessionContext();
  
  // --- KRİTİK GÜNCELLEME: KATILIMCI TAKİBİ ---
  // Odadaki diğer insanları (ve Agent'ı) listeler
  const participants = useRemoteParticipants();

  return (
    <AnimatePresence mode="wait">
      {!isConnected && (
        <MotionWelcomeView
          key="welcome"
          {...VIEW_MOTION_PROPS}
          startButtonText={appConfig.startButtonText}
          onStartCall={start}
        />
      )}
      {isConnected && (
        <div className="relative w-full h-full">
          {/* Odadaki katılımcı sayısını gösteren küçük bir panel (BT Monitor için ideal) */}
          <div className="fixed top-4 right-4 z-50 bg-black/50 p-2 rounded text-xs text-white">
            Aktif Katılımcılar: {participants.length + 1}
            <ul className="mt-1">
              {participants.map((p) => (
                <li key={p.identity} className="opacity-70">• {p.identity}</li>
              ))}
            </ul>
          </div>

          <MotionSessionView 
            key="session-view" 
            {...VIEW_MOTION_PROPS} 
            appConfig={appConfig} 
          />
        </div>
      )}
    </AnimatePresence>
  );
}
