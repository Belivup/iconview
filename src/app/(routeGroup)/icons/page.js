
import css from './page.module.css'
import ShowIcon from "@/app/(routeGroup)/icons/showIcon";
import prisma from "@/libs/prisma";

export default async function Page(){
	
	// This is Server Components, so Fetch from Server
	const iconFetch = await prisma.icon.findMany({
		take: 200,
		orderBy: [ { name: "asc" } ],
		where: {
			styles: { some: { type: { equals: "brands" } } }
		},
		include: {
			styles: true
		}
	})
	
	return(
		<div className={css.icon_cont}>
			<ShowIcon initIcons={iconFetch} />
		</div>
	)
}

