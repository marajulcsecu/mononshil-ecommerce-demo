export function AnnouncementBar() {
  return (
    <div className="bg-accent text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-center text-xs tracking-wide sm:px-6 lg:px-8">
        <span>Complimentary nationwide delivery on orders over Tk 3,000</span>
        <span className="hidden h-3 w-px bg-white/30 sm:inline-block" aria-hidden="true" />
        <span className="hidden sm:inline">Cash on Delivery, bKash, Nagad &amp; Card available</span>
      </div>
    </div>
  );
}
