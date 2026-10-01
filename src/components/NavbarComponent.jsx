import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavbarComponent({ user, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = () => { localStorage.removeItem("loggedUser"); onLogout?.(); navigate("/login", { replace: true }); };
  if (!user && pathname === "/login") return null;
  const isActive = (path) => pathname === path;
  return <Navbar expand="lg" className="top-nav" variant="dark" sticky="top">
    <Container>
      <Navbar.Brand as={Link} to={user ? "/fit" : "/login"}><span className="brand-mark">↗</span>FitJournal</Navbar.Brand>
      <Navbar.Toggle aria-controls="fitjournal-nav" />
      <Navbar.Collapse id="fitjournal-nav">
        {user && <Nav className="me-auto">
          <Nav.Link as={Link} to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/journal" className={isActive("/journal") ? "active" : ""}>Workout log</Nav.Link>
          <Nav.Link as={Link} to="/diet" className={isActive("/diet") ? "active" : ""}>Nutrition</Nav.Link>
          <Nav.Link as={Link} to="/fit" className={isActive("/fit") ? "active" : ""}>My goal</Nav.Link>
        </Nav>}
        <div className="d-flex align-items-center gap-3">
          {user ? <><span className="user-chip">Hi, <strong>{user.name}</strong></span><Button variant="outline-light" size="sm" onClick={logout}>Log out</Button></> : <Button as={Link} to="/login" variant="outline-light" size="sm">Log in</Button>}
        </div>
      </Navbar.Collapse>
    </Container>
  </Navbar>;
}
