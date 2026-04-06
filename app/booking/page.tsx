export default function BookingPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-white">
      <h1 className="text-4xl font-bold mb-4 tracking-wide">Book a Session</h1>
      <p className="text-gray-500 mb-12 text-center max-w-md">
        Choose a time that works for you. Calendly will be available here.
      </p>
      <div className="w-full max-w-2xl h-64 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
        Calendly widget placeholder
      </div>
    </main>
  );
}