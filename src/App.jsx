import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ProjectAdmin from "./components/ProjectAdmin";
import ImpactSection from "./components/ImpactSection";
import TeamSection from "./components/TeamSection";
import ReviewsPage from "./components/ReviewsPage";
import DonatePage from "./components/DonatePage";
import HomeSection from "./components/HomeSection";
import ScrollToTop from "./components/ScrollToTop";
import ContactSection from "./components/ContactSection";
import Admin from "./components/Admin";
import Dashboard from "./components/admin/Dashboard";
import PrivateRoute from "./components/admin/PrivateRoute";
import Featuredproject from "./components/Featuredproject";
import FeaturedGalleryAdmin from "./components/FeaturedGalleryAdmin";
import BlogPost from "./components/BlogPost";
import BlogList from "./components/BlogList";
import BlogsAdmin from "./components/BlogsAdmin";
import InternshipPage from "./components/ContactUs/InternshipPage";
import ParticleBackground from "./components/ParticleBackground";

const HomePage = () => (
  <div className="mx-auto">
    <ParticleBackground/>
    <section id="home">
      <HomeSection />
    </section>
    <section id="about">
      <AboutSection />
    </section>
    <section id="projects">
      <ProjectsSection />
    </section>
    <Featuredproject />
    <section id="impact">
      <ImpactSection />
    </section>
    <section id="Reviews">
      <ReviewsPage />
    </section>
    <section id="contact">
      <ContactSection />
    </section>
  </div>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage =
    location.pathname.toLowerCase() === "/admin" ||
    //  location.pathname.toLowerCase() === "/bgadmin" ||
    location.pathname.toLowerCase().startsWith("/dashboard");

  return (
    <>
      {!isAdminPage && <Loader />}
      <ScrollToTop />
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/team" element={<TeamSection/>} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/JoinUS" element={<InternshipPage />} />
        <Route path="/InternshipPage" element={<InternshipPage />} />
        <Route path="/blogs/:id" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />

        {/* Protected Dashboard with nested routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="projects" element={<ProjectAdmin />} />
          <Route path="blogs" element={<BlogsAdmin/>} />
          <Route path="featured-gallery" element={<FeaturedGalleryAdmin />} />
          {/* Add more nested routes here */}
        </Route>
      </Routes>
    </Layout>
  </Router>
);

export default App;
