import './App.css';
import Home from './Components/Home/Home';
import Video from './Components/Video/Video';
import SignIn from './Components/SignIn/SignIn';
import SignUp from './Components/SignUp/SignUp';
import Create from './Components/Create/Create';
import Channel from './Components/Channel/Channel';
import Search from './Components/Search/Search';
import NotFound from './Components/NotFound/NotFound';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/create" element={<Create />} />
          <Route path="/video/:id" element={<Video />} />
          <Route path="/channel/:creator" element={<Channel />} />
          <Route path="/channel/null" element={<NotFound />} />
          <Route path="/search/:search" element={<Search />} />
          <Route path="/search/null" element={<NotFound />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
