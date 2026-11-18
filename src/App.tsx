import { useEffect, useState } from "react";
import HomePage from "./pages/Home/Home";
import ShopPage from "./pages/Shop/ShopPage";
import { products } from "./data/products";
import { title } from "process";

export default function App() {
  document.title = "Snow Ski rental  | Snow Ski";
  const [showShop, setShowShop] = useState(
    window.location.hash === "#/productos",
  );

  useEffect(() => {
    const handleNavigation = () => {
      setShowShop(window.location.hash === "#/productos");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleNavigation);
    return () => window.removeEventListener("hashchange", handleNavigation);
  }, []);

  return showShop ? <ShopPage products={products} /> : <HomePage />;
}
