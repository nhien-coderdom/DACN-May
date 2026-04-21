import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./auth/pages/Register";
import MyOrders from "./pages/MyOrders";
import Profile from "./profile/pages/Profile";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Loyalty from "./pages/info/Loyalty";
import Contact from "./pages/info/Contact";
import PurchasePolicy from "./pages/info/PurchasePolicy";
import PrivacyPolicy from "./pages/info/PrivacyPolicy";
import Terms from "./pages/info/Terms";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/:category?" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/purchase-policy" element={<PurchasePolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout/success" element={<PaymentSuccess />} />
        <Route path="/checkout/failed" element={<PaymentFailed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;