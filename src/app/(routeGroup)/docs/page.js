import Docs from "@/app/_comp/docs";
import css from './page.module.css'
import Footer from "@/app/_comp/footer";

export default function Page(){
	return(
		<div className={css.docs_page}>
			
			<div className={css.docs_head}>
				<h1>Documents & Guidelines</h1>
			</div>
			
			<Docs />
			<Footer />
		</div>
	)
}