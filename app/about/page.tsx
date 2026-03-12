import Navbar from "@/components/navbar/Navbar";
import AboutDoctor from "@/components/about/AboutDoctor";
import Footer from "@/components/footer/Footer";

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