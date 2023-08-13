import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-light" id="footer">
            <hr></hr>
            <div className="container text-muted text-center">
                <p className="m-0">Copyright &copy; 2023 <a href="/" className="text-muted">Library Manager</a>. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;

