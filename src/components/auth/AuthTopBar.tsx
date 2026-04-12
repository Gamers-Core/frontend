import { Logo } from '../Logo';
import { buttonClassName, LocaleSwitcher, ModeToggle } from '../top-bar';

export const AuthTopBar = () => (
  <header className="fixed top-0 inset-x-0 right-(--removed-body-scroll-bar-size,0) text-sm font-medium text-muted-foreground md:container flex items-center justify-between px-4 py-3 z-50 transition-colors duration-300">
    <Logo className="text-black dark:text-white" />

    <nav className="flex items-center gap-1.5 text-gray-900 dark:text-white transition-colors duration-300">
      <ModeToggle className={buttonClassName(false)} />

      <LocaleSwitcher className={buttonClassName(false)} />
    </nav>
  </header>
);
