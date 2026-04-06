import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold tracking-widest">
          KAKO
        </Link>
        <ul className="flex gap-8 text-white text-sm tracking-wider">
          <li><Link href="/" className="hover:text-pink-400 transition">Home</Link></li>
          <li><Link href="/booking" className="hover:text-pink-400 transition">Booking</Link></li>
          <li><Link href="/payment" className="hover:text-pink-400 transition">Payment</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;