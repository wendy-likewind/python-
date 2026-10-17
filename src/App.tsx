import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';

import { routes, type RouteConfig } from './routes';

function renderRoutes(routeList: RouteConfig[]) {
  return routeList.map((route) => {
    if (route.children?.length) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children.map((child) => (
            <Route
              key={`${route.path}/${child.path || 'index'}`}
              index={child.path === ''}
              path={child.path === '' ? undefined : child.path}
              element={child.element}
            />
          ))}
        </Route>
      );
    }
    return <Route key={route.path} path={route.path} element={route.element} />;
  });
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const App: React.FC = () => {
  return (
    <Router basename={basename}>
      <IntersectObserver />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {renderRoutes(routes)}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
};

export default App;
