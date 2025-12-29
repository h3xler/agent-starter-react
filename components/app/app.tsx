'use client';

import { useMemo } from 'react';
import { TokenSource } from 'livekit-client';
import { RoomAudioRenderer, SessionProvider, StartAudio, useSession } from '@livekit/components-react';
import { ViewController } from '@/components/app/view-controller';

export function App({ appConfig, roomName }: { appConfig: any, roomName?: string }) {
  const tokenSource = useMemo(() => {
    // URL'ye parametre ekleyerek API'ye gönderiyoruz (En sağlam yöntem)
    const endpoint = roomName 
      ? `/api/connection-details?room=${roomName}` 
      : '/api/connection-details';
      
    return TokenSource.endpoint(endpoint);
  }, [roomName]);

  const session = useSession(tokenSource);

  return (
    <SessionProvider session={session}>
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController appConfig={appConfig} />
      </main>
      <StartAudio label="Start Audio" />
      <RoomAudioRenderer />
    </SessionProvider>
  );
}
