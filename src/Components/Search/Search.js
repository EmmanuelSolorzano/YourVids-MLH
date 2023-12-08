import "./Search.css";
import { useParams } from "react-router-dom";
import PaginationResults from "../Pagination/PaginationResults";
import Banner from "../Banner/Banner";
import NavScroll from "../NavScroll/NavScroll";

function Channel() {
    const { search } = useParams();

    return (
      <div>
        <NavScroll />
        <Banner />
        <div className="heading-container">
          <h2>
          Resultados para <span className="hcolor">{search}</span>
          </h2>
        </div>
        <PaginationResults searchLocal={search} />
      </div>
    );
}

export default Channel;
