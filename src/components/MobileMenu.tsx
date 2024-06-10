'use client';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { navbarLinks } from './NavbarLinks';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const MobileMenu = () => {
	const pathname = usePathname();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon">
					<Menu className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<div className="mt-5 flex px-2 space-y-1 flex-col">
					{navbarLinks.map((item) => (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								pathname === item.href ? 'bg-muted' : 'hover:bg-muted hover:bg-opacity-75',
								'group flex items-center px-2 py-2 font-medium rounded-md',
							)}
						>
							{item.name}
						</Link>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileMenu;
