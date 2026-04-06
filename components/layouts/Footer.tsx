import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xl font-bold tracking-widest">KAKO</p>
        <ul className="flex gap-8 text-sm tracking-wider">
          <li><Link href="/" className="hover:text-pink-400 transition">Home</Link></li>
          <li><Link href="/booking" className="hover:text-pink-400 transition">Booking</Link></li>
          <li><Link href="/payment" className="hover:text-pink-400 transition">Payment</Link></li>
        </ul>
        <p className="text-sm text-white/50">© {new Date().getFullYear()} Kako. All rights reserved.</p>
      </div>
    </footer>
  );
}