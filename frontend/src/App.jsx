import { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Banner from "./components/banner";
import About from "./components/about";
import Portfolio from "./components/portfolio";
import Pricecard from "./components/pricecard";
import FAQ from "./components/faq";
import Footer from "./components/footer";
import PortfolioPage from "./components/portfolio-page";
import Features from "./components/features";
import Auth from "./components/auth";
import Dashboard from "./components/dashboard";
import CustomSiteForm from "./components/custom-site-form";
import CustomSiteSuccess from "./components/custom-site-success";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fonction pour naviguer vers une page
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Fonction de connexion
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("dashboard");
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  // Gestion de la navigation par URL au chargement
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/portfolio") {
      setCurrentPage("portfolio");
    } else if (path === "/auth") {
      setCurrentPage("auth");
    } else if (path === "/custom-site-form") {
      setCurrentPage("custom-site-form");
    } else if (path === "/custom-site-success") {
      setCurrentPage("custom-site-success");
    } else if (path === "/dashboard") {
      if (user) {
        setCurrentPage("dashboard");
      } else {
        setCurrentPage("home");
      }
    } else {
      setCurrentPage("home");
    }
  }, [user]);

  // Mise à jour de l'URL lors du changement de page
  useEffect(() => {
    if (currentPage === "portfolio") {
      window.history.pushState({}, "", "/portfolio");
    } else if (currentPage === "auth") {
      window.history.pushState({}, "", "/auth");
    } else if (currentPage === "custom-site-form") {
      window.history.pushState({}, "", "/custom-site-form");
    } else if (currentPage === "custom-site-success") {
      window.history.pushState({}, "", "/custom-site-success");
    } else if (currentPage === "dashboard") {
      window.history.pushState({}, "", "/dashboard");
    } else {
      window.history.pushState({}, "", "/");
    }
  }, [currentPage]);

  // Gestion du bouton retour du navigateur
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/portfolio") {
        setCurrentPage("portfolio");
      } else if (path === "/auth") {
        setCurrentPage("auth");
      } else if (path === "/custom-site-form") {
        setCurrentPage("custom-site-form");
      } else if (path === "/custom-site-success") {
        setCurrentPage("custom-site-success");
      } else if (path === "/dashboard") {
        if (user) {
          setCurrentPage("dashboard");
        } else {
          setCurrentPage("home");
        }
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [user]);

  // Écouter les événements de navigation personnalisés
  useEffect(() => {
    const handleNavigate = (event) => {
      navigateTo(event.detail);
    };

    window.addEventListener("navigate", handleNavigate);
    return () => window.removeEventListener("navigate", handleNavigate);
  }, []);

  return (
    <div className="App">
      {currentPage !== "dashboard" && currentPage !== "custom-site-success" && (
        <Navbar onNavigate={navigateTo} user={user} onLogout={handleLogout} isAuthPage={currentPage === "auth"} isCustomSiteForm={currentPage === "custom-site-form"} />
      )}
      
      {currentPage === "home" ? (
        <>
          <Banner /> 
          <Portfolio />
          <Features />
          <Pricecard />
          <FAQ />
          <About />
          <Footer />
        </>
      ) : currentPage === "portfolio" ? (
        <PortfolioPage />
      ) : currentPage === "auth" ? (
        <Auth onLogin={handleLogin} />
      ) : currentPage === "custom-site-form" ? (
        <CustomSiteForm onClose={() => navigateTo("home")} />
      ) : currentPage === "custom-site-success" ? (
        <CustomSiteSuccess />
      ) : currentPage === "dashboard" ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : null}
    </div>
  );
}

export default App;
