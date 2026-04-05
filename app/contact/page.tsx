import Navbar from "@/components/navbar/Navbar";
import BookingForm from "@/components/booking/BookingForm";
import Footer from "@/components/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Book Appointment | G. Suma Kavitha",
  description: "Book an appointment for online or in-person therapy with G. Suma Kavitha in Hyderabad. Flexible scheduling available.",
};

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