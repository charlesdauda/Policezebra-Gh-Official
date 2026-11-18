import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const { pathname } = useLocation();
  const isAccountPage = pathname === "/account" || pathname.startsWith("/account/");

  return (
    <>
      <ScrollToTop />
      {!isAccountPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      {!isAccountPage && <Footer />}
    </>
  );
};

export default App;