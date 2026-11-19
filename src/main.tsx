import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
import '@fontsource/jetbrains-mono/400.css';
import './styles/tokens.css';
import './styles/app.css';
import { AppShell } from './app/AppShell';
import { useRoute } from './lib/router';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { SectionPage } from './pages/SectionPage';
import { FavoritesPage } from './pages/Favorites';
import { Docs } from './pages/Docs';

function Router() {
  const route = useRoute();
  // Move focus and scroll to the top on page changes, but not for in-page filter edits.
  const key = route.name === 'section' ? `s:${route.id}` : route.name === 'docs' ? `d:${route.topic ?? ''}` : route.name;
  useEffect(() => { window.scrollTo(0, 0); document.title = 'FeatureFlow'; }, [key]);
  switch (route.name) {
    case 'home': return <Home />;
    case 'explore': return <Explore params={route.params} />;
    case 'section': return <SectionPage id={route.id} />;
    case 'favorites': return <FavoritesPage />;
    case 'docs': return <Docs topic={route.topic} />;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShell><Router /></AppShell>
  </StrictMode>,
);
