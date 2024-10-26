import { Hexagon } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/custom/theme-toggle';

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between gap-8 px-8">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-4">
          <div className="border-r p-2 pl-0">
            <Button variant="outline" size="icon" aria-label="Home">
              <Hexagon className="size-5 fill-foreground" />
            </Button>
          </div>
          <h1 className="text-xl font-semibold">Memoir</h1>
        </header>

        <div className="ml-auto flex gap-2 p-2 pr-0">
          <Link to="/" className="[&.active>*]:font-bold">
            <Button variant="link" size="sm">
              Home
            </Button>
          </Link>
          <Link to="/videos" className="[&.active>*]:font-bold">
            <Button variant="link" size="sm">
              Videos
            </Button>
          </Link>
          <Link to="/upload" className="[&.active>*]:font-bold">
            <Button variant="link" size="sm">
              Upload
            </Button>
          </Link>
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
}
