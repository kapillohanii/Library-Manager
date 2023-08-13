import React from "react";
import Search from './Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

function Header() {
    return ( 
        <div className="sticky-top bg-white p-3">
            <div className="container d-flex flex-column flex-md-row align-items-center">
                <div><a href='/' style={{color:'black'}}><h1 className="H1">Library Manager</h1></a></div>
                <div><Search /></div>
                <div>
                    <a href="/issue" className="Nav">Issue Books</a>
                    <a href="/return" className="Nav">Return Books</a>
                    <a href="/pending" className="Nav">Pending Transactions</a>
                </div>
            </div>
        </div> 
    );
}

export default Header;
