import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/BlogX.png')] bg-cover bg-center ">
      
      <Navbar />     
      <main className="flex-grow flex items-center justify-center">
        <Header />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
