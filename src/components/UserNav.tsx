import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

const UserNav = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10">
						<AvatarFallback>JAN.</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p>Jan Marshal</p>
					</div>
				</DropdownMenuLabel>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserNav;
