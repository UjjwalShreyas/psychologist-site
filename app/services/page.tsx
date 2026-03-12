import Navbar from "@/components/navbar/Navbar";
import Services from "@/components/services/Services";
import Footer from "@/components/footer/Footer";

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