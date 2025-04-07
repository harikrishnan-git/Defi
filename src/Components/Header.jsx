import React from "react";
import dapp from "/dapp.png";

const Navbar = ({ setPage }) => {
  return (
    <footer className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-1 shadow ">
      <div className="justify-content-start d-flex">
        <img src={dapp} alt="" height={40} width={40} />
        <h2 className="text-light mx-2">Token Yield Farm</h2>
      </div>
      <div className="justify-content-end">
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <button
              className="btn btn-outline-success my-2 my-sm-0 mx-2"
              onClick={() => setPage("stake")}
            >
              STAKE
            </button>
            <button
              className="btn btn-outline-primary my-2 my-sm-0"
              onClick={() => setPage("transfer")}
            >
              TRANSFER
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Navbar;
