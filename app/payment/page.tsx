export default function PaymentPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-white">
      <h1 className="text-4xl font-bold mb-4 tracking-wide">Payment</h1>
      <p className="text-gray-500 mb-12 text-center max-w-md">
        Select a package below to proceed with your booking.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {["Basic", "Standard", "Premium"].map((tier) => (
          <div key={tier} className="border border-gray-200 rounded-lg p-8 flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">{tier}</h2>
            <p className="text-gray-400 text-sm text-center">Package details coming soon.</p>
            <div className="mt-auto w-full py-2 text-center rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
              Stripe button placeholder
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}