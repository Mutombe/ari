import React from 'react';
import { useEffect } from 'react';
import {
  useLocation
} from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/home/home';
import Navigation from './components/nav/nav';
import About from './components/about/about';
import Footer from './components/footer/footer';
import IssueRequestDashboard from './components/dashboard/issueRequestdashboard';
import UserDashboard from './components/dashboard/deviceDashboard';
import ProfilePage from './components/profile/profile';
import AdminDashboard from './components/dashboard/admin';
import ResetPasswordPage from './components/nav/passwordReset';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
      <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/devices" element={<UserDashboard />} />
          <Route path='/profile' element={<ProfilePage />} />
          {/*<Route path="/help" element={<HelpCenter />} />*/}
          {/*<Route path="/gallery" element={<GalleryPage />} />*/}
          {/*<Route path="/documentation" element={<DocumentationPage />} />*/}
          {/*<Route path="/settings" element={<Settings />} />*/}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/issue-requests" element={<IssueRequestDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
export default App
