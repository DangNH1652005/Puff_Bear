import { useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Card,
  Row,
  Col,
  Badge,
  Form,
} from "react-bootstrap";
import { ShoppingCart, Heart, Search, Star, Truck } from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import Hero from "../components/public/Hero";
import FeaturesSection from "../components/public/FeaturesSection";
import BestSellerSection from "../components/public/BestSellerSection";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturesSection />
      <BestSellerSection />
    </div>
  );
}
