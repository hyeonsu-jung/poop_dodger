import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // 앱인토스 콘솔에 등록한 appName과 동일하게 맞춰 주세요.
  appName: 'poop-dodger',
  brand: {
    displayName: 'Poop Survivor',
    primaryColor: '#e94560',
    icon: 'https://lsxzjsjioeoqgvxnwjvv.supabase.co/storage/v1/object/public/image/poop.PNG',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite --host',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
  webViewProps: {
    type: 'game',
  },
});
