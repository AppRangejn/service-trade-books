import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ThemeRegistry } from '@/components/ThemeRegistry';
import { StoreProvider } from '@/store/StoreProvider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'BooksTrade — Book Exchange Service',
  description: 'Community platform for sharing and exchanging books',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <StoreProvider>
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Suspense fallback={null}>
                <Header />
              </Suspense>
              <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
                <Suspense
                  fallback={
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', py: 10 }}
                    >
                      <CircularProgress />
                    </Box>
                  }
                >
                  {children}
                </Suspense>
              </Container>
              <Footer />
            </Box>
          </StoreProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
