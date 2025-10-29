import { GraduationCap } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="p-2 rounded-lg bg-gradient-primary">
        <GraduationCap className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-foreground leading-none">EduPlacement</span>
        <span className="text-xs text-muted-foreground leading-none">AI</span>
      </div>
    </div>
  );
};
