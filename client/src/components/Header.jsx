import React, { useState } from "react";
import Search from './Search';
import '../App.css'

function Header() {
    const [showNav, setShowNav] = useState(false);

    const toggleNav = () => {
        setShowNav(!showNav);
    };

    return ( 
        <div className="sticky-top bg-white p-3" >
            <div className="container d-flex flex-column flex-md-row align-items-center" style={{maxWidth:'max-content',justifyContent:'space-between'}}>
                <div><a href='/' style={{color:'black'}}><h1 className="H1">LibraryManager</h1></a></div>
                <div><Search /></div>
                <div className={`nav-links ${showNav ? 'show' : ''}`}>
                    {showNav && <button className="bton red" onClick={toggleNav}>x</button>}
                    <a href="/issue" className="Nav">Issue Books</a>
                    <a href="/return" className="Nav">Return Books</a>
                    <a href="/pending" className="Nav">Pending Transactions</a>
                </div>
                <div className="burger-icon" onClick={toggleNav}>
                    <div className={`bar${showNav ? ' active' : ''}`}></div>
                    <div className={`bar${showNav ? ' active' : ''}`}></div>
                    <div className={`bar${showNav ? ' active' : ''}`}></div>
                </div>
            </div>
        </div> 
    );
}

export default Header;
