import { Link } from "react-router-dom";
import Banner from "../Banner/Banner";

function NotFound() {

  const backHome = () => {
    window.location.href = `/`;
  }
    
    return (
      <div>
        <h2>No encontramos nada relacionado a tu búsqueda.</h2>
        <Link className="backHome" onClick={backHome}>Volver</Link>
      </div>
    );
}

export default NotFound;
