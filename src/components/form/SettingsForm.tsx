'use client';

import { FC } from 'react';
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton';

interface IAppProps {
	firstName: string;
	lastName: string;
	email: string;
}

const SettingsForm: FC<IAppProps> = ({ firstName, lastName, email }) => {
	return (
		<form>
			<CardHeader>
				<CardTitle>Settings</CardTitle>
				<CardDescription>Here you will find settings regarding your account</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-y-5">
				<div className="flex flex-col gap-y-2">
					<div className="flex flex-col gap-y-2">
						<Label>First Name</Label>
						<Input name="firstName" type="text" defaultValue={firstName} />
					</div>

					<div className="flex flex-col gap-y-2">
						<Label>Last Name</Label>
						<Input name="lastName" type="text" defaultValue={lastName} />
					</div>

					<div className="flex flex-col gap-y-2">
						<Label>Email</Label>
						<Input name="email" type="email" disabled defaultValue={email ?? 'jan@alenix.de'} />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<SubmitButton title="Update your settings" />
			</CardFooter>
		</form>
	);
};

export default SettingsForm;
