export default function NeonDivider() {
  return (
    <div className="relative flex items-center justify-center">

      {/* Neon vertical line (desktop) */}
      <div className="hidden md:block w-1 h-full relative">
        <div className="absolute inset-0 bg-accent opacity-60 animate-pulse"></div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-accent to-transparent blur-sm animate-pulse"></div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-accent/30 via-accent/50 to-accent/30 animate-move"></div>
      </div>

      {/* Neon horizontal line (mobile) */}
      <div className="md:hidden w-full h-[2px] relative">
        <div className="absolute inset-0 bg-accent opacity-60 animate-pulse"></div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-accent to-transparent blur-sm animate-pulse"></div>
      </div>
    </div>
  );
}
