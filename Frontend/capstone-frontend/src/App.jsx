import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Footer from "./Footer.jsx";
import MovieSpotlight from "./MovieSpotlight.jsx";
import SubmitFilm from "./SubmitFilm.jsx";
import ReviewMovie from "./ReviewMovie.jsx";
import MyReel from "./MyReel.jsx";
import About from "./About.jsx";
import Catalog from "./Catalog.jsx";

function App() {
  return (
    <>
      <Navbar />

      {/* Main content area */}
      <main
        style={{
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
          marginBottom: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          minHeight: "80vh",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalog />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login mode="signup" />} />

          {/* Movie spotlight page (dynamic route using movie ID) */}
          <Route path="/spotlight/:id" element={<MovieSpotlight />} />

          <Route path="/submit-a-film" element={<SubmitFilm />} />
          <Route path="/review-a-movie" element={<ReviewMovie />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-reel" element={<MyReel />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
