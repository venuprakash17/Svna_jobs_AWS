import { GraduationCap } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
        <span className="text-white font-bold text-lg">S</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-foreground text-lg leading-tight">SvnaJobs</span>
      </div>
    </div>
  );
};
