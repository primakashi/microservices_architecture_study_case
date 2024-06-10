import Head from 'next/head';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import _ from 'lodash';
import OrderItem from '../../components/OrderItem';

const Orders = ({ orderList }) => {
	let { t } = useTranslation();

	const ordersEmpty = (
		<div className="py-24 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:text-center">
					<h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
						{t('orders:order_history')}
					</h2>
					<p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
						{t('orders:no_orders')}
					</p>
					<p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
						{t('orders:suggestion')}{' '}
						<Link href="/">
							<a
								rel="noopener noreferrer"
								className="underline text-indigo-600"
							>
								{t('orders:main_page')}
							</a>
						</Link>
						{t('orders:use_catalog_search')}{' '}
					</p>
				</div>
			</div>
		</div>
	);

	const history = (
		<div>
			<Head>
				<title>{t('orders:title')}</title>
			</Head>

			<main>
				<div className="bg-white max-w-2xl mx-auto py-8 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
					<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
						{t('orders:order_history')}
					</h2>

					{_.map(orderList, order => (
						<OrderItem key={order.id} order={order} />
					))}
				</div>
			</main>
		</div>
	);

	return !orderList.length ? ordersEmpty : history;
};

Orders.getInitialProps = async (context, client, currentUser) => {
	if (currentUser) {
		const { data } = await client.get(`/api/checkout`);
		return {
			orderList: data,
		};
	}
};

export default Orders;
