import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import _ from 'lodash';
import useRequest from '../../hooks/use-request';
import { useState } from 'react';
import CartItem from '../../components/CartItem';

const Cart = ({ cart, amount_total, cartTotal, setCartTotal }) => {
	let { t } = useTranslation();
	const router = useRouter();
	const [total, setTotal] = useState(amount_total);
	const { doRequest, errors } = useRequest({
		url: '/api/checkout',
		method: 'post',
		onSuccess: session => router.push(session.url),
	});

	const emptyCart = (
		<div className="flex flex-col items-center justify-center p-24">
			<main className="flex flex-col items-center justify-center w-full flex-1 text-center px-4">
				<h1 className="text-6xl font-bold">
					{t('cart:shopping_cart')}{' '}
					<a className="text-blue-600">{t('cart:empty')}</a>
				</h1>

				<p className="mt-3 text-2xl">
					{t('cart:suggestion')}{' '}
					<Link href="/">
						<a rel="noopener noreferrer" className="underline text-indigo-600">
							{t('cart:main_page')}
						</a>
					</Link>
					{t('cart:use_catalog_search')}{' '}
				</p>

				<div className="flex flex-wrap items-center justify-around max-w-4xl   mt-6 lg:w-full ">
					<Link href="/books">
						<a
							rel="noopener noreferrer"
							className="h-36 p-6 mt-6  text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
						>
							<h3 className="text-2xl font-bold">{t('cart:books')} &rarr;</h3>
							<p className="mt-4 text-xl">{t('cart:books_suggestion')}</p>
						</a>
					</Link>
					<Link href="/stationery">
						<a
							rel="noopener noreferrer"
							className="h-36 p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
						>
							<h3 className=" text-2xl font-bold">
								{t('cart:stationery')} &rarr;
							</h3>
							<p className="mt-4 text-xl">{t('cart:stationery_suggestion')}</p>
						</a>
					</Link>
				</div>
			</main>
		</div>
	);

	return (
		<div>
			<Head>
				<title>{t('cart:title')}</title>
			</Head>

			<main>
				{cart.length ? (
					<div className="bg-white max-w-2xl mx-auto py-8 px-4  sm:px-6 lg:max-w-7xl lg:px-8">
						<h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
							{t('cart:shopping_cart')}
						</h2>

						<div className="grid grid-cols-7 gap-10">
							<div className="mt-6 lg:col-span-4 col-span-7">
								<div className="flow-root">
									<ul role="list" className="-my-6 divide-y divide-gray-200">
										{cart.map(product => (
											<CartItem
												key={product.id}
												product={product}
												total={total}
												setTotal={setTotal}
												setCartTotal={setCartTotal}
												cartTotal={cartTotal}
											/>
										))}
									</ul>
								</div>
							</div>
							<div className=" lg:col-span-3 col-span-7">
								<div className="rounded-lg h-68 lg:h-48 bg-gray-50  py-6  ">
									<div className="flex px-6 justify-between text-base font-medium text-gray-900">
										<p>{t('cart:total')}</p>
										<p>
											{'$'}
											{total / 100}
										</p>
									</div>
									<div className="mt-6 px-6">
										<button
											onClick={() => doRequest()}
											className="flex w-full justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
										>
											{t('cart:checkout')}
										</button>
									</div>
									<div className="mt-6 px-6 flex justify-center text-sm text-center text-gray-500">
										<p>
											{t('cart:or')}{' '}
											<Link href="/">
												<a
													rel="noopener noreferrer"
													type="button"
													className="text-indigo-600 font-medium hover:text-indigo-500"
												>
													{t('cart:continue_shopping')}
													<span aria-hidden="true"> &rarr;</span>
												</a>
											</Link>
										</p>
									</div>
								</div>
								{/*Test card details */}
								<div
									className="mt-4 px-4 py-3 leading-normal grid grid-cols-2 text-indigo-700 border border-indigo-500 rounded-lg"
									role="alert"
								>
									<p>{t('cart:test_card_details')}</p>
									<p>4242 4242 4242 4242</p>
									<p>{t('cart:date')}</p>
									<p>{t('cart:date_descr')}</p>
									<p>CVC:</p>
									<p>{t('cart:cvc_descr')}</p>
								</div>
							</div>
						</div>
					</div>
				) : (
					emptyCart
				)}
			</main>
		</div>
	);
};

Cart.getInitialProps = async (context, client, currentUser) => {
	if (currentUser) {
		const { data } = await client.get('/api/cart');

		return { cart: data.cart, amount_total: data.amount_total };
	}

	return { cart: [], amount_total: null };
};

export default Cart;
