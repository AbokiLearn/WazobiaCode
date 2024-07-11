import HeaderLogo from './header-logo';
import { ProfileMenu, type User } from './profile-menu';

interface HeaderProps {
  title: string | React.ReactNode;
  user: User;
  searchBar?: React.ReactNode;
  children?: React.ReactNode;
}

export const Header = ({ title, user, searchBar, children }: HeaderProps) => {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-primary px-4 lg:h-[60px] lg:px-6">
      {children}
      <HeaderLogo />
      <h2 className="font-semibold text-primary-foreground text-lg sm:text-xl md:text-2xl">
        {title}
      </h2>
      <div className="ml-auto flex items-center gap-4">
        {searchBar}
        {user && <ProfileMenu user={user} />}
      </div>
    </header>
  );
};
