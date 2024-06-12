import { Card } from '@/components/ui/card';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import SettingsForm from '@/components/form/SettingsForm';
import { unstable_noStore as noStore } from 'next/cache';

const getData = async (id: string) => {
	const data = await prisma.user.findUnique({
		where: {
			id,
		},
		select: {
			firstName: true,
			lastName: true,
			email: true,
		},
	});

	return data;
};

const SettingsPage = async () => {
	noStore();
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user) redirect('/');

	const data = await getData(user.id);

	return (
		<section className="max-w-7xl mx-auto md:px-8">
			<Card>
				<SettingsForm email={data!.email} firstName={data!.firstName} lastName={data!.lastName} />
			</Card>
		</section>
	);
};

export default SettingsPage;
