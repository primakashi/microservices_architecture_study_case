import 'tailwindcss/tailwind.css';
import buildClient from '../api/build-client';
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import '../public/nprogress.css';
import { useState, useEffect } from 'react';

const Header = dynamic(() => import('../components/Header'));
const Footer = dynamic(() => import('../components/Footer'));

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const AppComponent = ({ Component, pageProps, currentUser, prod_total }) => {
	const router = useRouter();
	const [cartTotal, setCartTotal] = useState(prod_total);

	useEffect(() => {}, [cartTotal]);

	return (
		<div>
			<Header
				currentUser={currentUser}
				prod_total={cartTotal}
				locale={router.locale}
			/>

			<div className="min-h-screen">
				<Component
					currentUser={currentUser}
					{...pageProps}
					setCartTotal={setCartTotal}
					cartTotal={cartTotal}
				/>
			</div>
			<Footer />
		</div>
	);
};

AppComponent.getInitialProps = async appContext => {
	const client = buildClient(appContext.ctx);
	const { data } = await client.get('/api/users/currentuser');
	let prod_total;

	if (data.currentUser) {
		const {
			data: { products_total },
		} = await client.get('/api/cart?total=true');

		prod_total = products_total;
	}

	let pageProps = {};
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(
			appContext.ctx,
			client,
			data.currentUser,
			prod_total
		);
	}

	return {
		pageProps,
		prod_total,
		...data,
	};
};

export default AppComponent;
