import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page-container">
      <div className="not-found-page">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you are looking for does not exist.
        </p>
        <Link to="/dashboard" className="go-back-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
