import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen w-full bg-[#020617] relative flex flex-col">
      {/* Dark Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)`,
        }}
      />

      {/* Page Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Header />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
