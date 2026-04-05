import Navbar from "@/components/navbar/Navbar";
import AboutDoctor from "@/components/about/AboutDoctor";
import Footer from "@/components/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About G. Suma Kavitha | Psychologist in Hyderabad",
  description: "Learn more about G. Suma Kavitha, a professional counselling psychologist with over 10 years of experience helping individuals and families in Hyderabad.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <AboutDoctor />
      </main>
      <Footer />
    </>
  );
}