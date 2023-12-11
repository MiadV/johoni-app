'use client';

import { useAuth } from '~/contexts/AuthContext';
import { Icons } from '~/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    name?: string;
    role?: string;
  };
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { logout } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Icons.user className="h-8 w-8 rounded-full border" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.role && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.role}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            logout();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
