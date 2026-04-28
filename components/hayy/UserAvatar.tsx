import { cn } from "@/lib/utils";
import type { User } from "@/lib/mockData";

interface UserAvatarProps {
  user: Pick<User, "initials" | "avatarColor" | "name">;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
}

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export const UserAvatar = ({ user, size = "md", className, ring }: UserAvatarProps) => {
  return (
    <span
      title={user.name}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-display font-semibold text-clay-foreground select-none",
        user.avatarColor,
        sizeMap[size],
        ring && "ring-2 ring-card",
        className,
      )}
    >
      {user.initials}
    </span>
  );
};
