import HeaderLogo from './header-logo';
import { ProfileMenu, type User } from './profile-menu';
import { Search } from './search';

interface HeaderProps {
  title: string | React.ReactNode;
  user: User;
  children?: React.ReactNode;
}

export const Header = ({ title, user, children }: HeaderProps) => {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-primary px-4 lg:h-[60px] lg:px-6">
      {children}
      <HeaderLogo />
      <h2 className="font-semibold text-primary-foreground text-lg sm:text-xl md:text-2xl">
        {title}
      </h2>
      <div className="ml-auto flex items-center gap-4">
        <Search />
        {user && <ProfileMenu user={user} />}
      </div>
    </header>
  );
};
