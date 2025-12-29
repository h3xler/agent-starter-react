import { headers } from 'next/headers';
import { App } from '@/components/app/app';
import { getAppConfig } from '@/lib/utils';

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // URL'deki ?room=... parametresini yakalıyoruz
  const searchParams = await props.searchParams;
  const roomName = searchParams.room as string | undefined;

  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  // Yakaladığımız roomName'i App bileşenine prop olarak gönderiyoruz
  return <App appConfig={appConfig} roomName={roomName} />;
}
