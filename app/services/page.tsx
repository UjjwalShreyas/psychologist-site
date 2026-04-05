import Navbar from "@/components/navbar/Navbar";
import Services from "@/components/services/Services";
import Footer from "@/components/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Counselling Services | G. Suma Kavitha",
  description: "Explore our range of psychological services including individual therapy, couples counselling, teen support, and family therapy in Hyderabad.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Services />
      </main>
      <Footer />
    </>
  );
}