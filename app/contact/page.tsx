import Navbar from "@/components/navbar/Navbar";
import BookingForm from "@/components/booking/BookingForm";
import Footer from "@/components/footer/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}