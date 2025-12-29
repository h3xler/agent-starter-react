import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // URL'den gelen ?room=... parametresini yakala
    const roomFromQuery = searchParams.get('room');
    
    let body = {};
    try { body = await req.json(); } catch (e) { /* body boş olabilir */ }

    // ÖNCE URL'deki odaya bak, yoksa body'deki odaya bak, o da yoksa rastgele üret
    const roomName = roomFromQuery || (body as any)?.roomName || `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;
    
    const participantIdentity = `user_${Math.floor(Math.random() * 10_000)}`;

    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: participantIdentity,
      name: 'user',
      ttl: '15m',
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({
      serverUrl: LIVEKIT_URL,
      roomName: roomName,
      participantToken: await at.toJwt(),
      participantName: 'user',
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
