import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/index.scss";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SearchForm from "./pages/SearchForm";
import Result from "./pages/Result";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/search" element={<SearchForm />} />
              <Route path="/result" element={<Result />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
