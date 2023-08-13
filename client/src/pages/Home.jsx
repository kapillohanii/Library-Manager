import React from "react";
import '../App.css'
import Header from "../components/Header";
import Books from "../components/Books";
import Members from "../components/Members";
import Footer from "../components/Footer";

function Home() {
    return (
        <div className="content">
            <Header />
            <Books />
            <Members />
            <Footer />
        </div>
    );
}

export default Home;

