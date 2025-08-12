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

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  // Fonction pour naviguer vers une page
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Gestion de la navigation par URL au chargement
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/portfolio") {
      setCurrentPage("portfolio");
    } else {
      setCurrentPage("home");
    }
  }, []);

  // Mise à jour de l'URL lors du changement de page
  useEffect(() => {
    if (currentPage === "portfolio") {
      window.history.pushState({}, "", "/portfolio");
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
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
      <Navbar onNavigate={navigateTo} />
      
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
      ) : (
        <PortfolioPage />
      )}
    </div>
  );
}

export default App;
