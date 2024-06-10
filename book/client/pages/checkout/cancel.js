import Head from 'next/head';
import Link from 'next/link';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';

const Cancel = ({ checkout }) => {
	let { t } = useTranslation();

	const amount_total = checkout.cart
		.map(item => item.price * item.quantity)
		.reduce((a, b) => a + b, 0);

	return (
		<div>
			<Head>
				<title>{t('cancel:title')}</title>
			</Head>

			<main>
				<>
					<div className="bg-white max-w-2xl mx-auto lg:max-w-7xl px-4 lg:px-8 py-4">
						<div className="grid grid-cols-6 gap-4">
							<div className="mt-5 col-span-6 lg:col-start-2 lg:col-span-4">
								<div className="shadow sm:rounded-md sm:overflow-hidden">
									<div className="px-4 py-6 bg-white space-y-2 ">
										<div className="mb-4 space-y-2">
											<a className="font-medium text-red-700">
												{t('cancel:header')}
											</a>
											<h1 className="text-5xl font-extrabold text-gray-900">
												{t('cancel:body')}
											</h1>
											<p className="font-medium text-gray-400 ">
												{t('cancel:footer')}
											</p>
										</div>
										<div className="font-medium py-6 ">
											<p>{t('cancel:orderId')}</p>
											<p className="text-indigo-600">{checkout.id}</p>
										</div>
										<div className="border-b border-gray-200">
											{_.map(checkout.cart, product => {
												return (
													<li
														key={product.name}
														className="py-6 flex border-t border-gray-200"
													>
														<div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
															<img
																src={product.image}
																alt={product.name}
																className="w-full h-full object-center object-cover"
															/>
														</div>

														<div className="ml-4 flex-1 flex flex-col">
															<div>
																<div className="flex justify-between text-base font-medium text-gray-900">
																	<h3>
																		<a href={product.href}>{product.name}</a>
																	</h3>
																	<p className="ml-4">
																		{'$'}
																		{product.price / 100}
																	</p>
																</div>
															</div>
															<div className="flex-1 flex items-end justify-between ">
																<p className="text-gray-400">
																	{t('cancel:quantity')} {product.quantity}
																</p>
															</div>
														</div>
													</li>
												);
											})}
										</div>
										<div className="flex justify-between text-base font-medium text-gray-900">
											<h3>
												<a>{t('cancel:total')}</a>
											</h3>
											<p className="ml-4">
												{'$'}
												{amount_total / 100}
											</p>
										</div>
									</div>

									{/* Footer */}
									<div className="px-4 py-6  text-right">
										<div className="-mt-6  justify-end text-sm text-right text-gray-500">
											<Link href="/">
												<a
													rel="noopener noreferrer"
													type="button"
													className="text-indigo-600 font-medium hover:text-indigo-500"
												>
													{t('cancel:continue_shopping')}
													<span aria-hidden="true"> &rarr;</span>
												</a>
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			</main>
		</div>
	);
};

Cancel.getInitialProps = async (context, client, currentUser) => {
	if (currentUser) {
		try {
			const { session_id } = context.query;
			const { data } = await client.get(`/api/checkout/${session_id}/cancel`);
			return {
				checkout: data[0],
			};
		} catch (err) {
			// Redirect if the session_id does not exist
			// context.res.writeHead(303, { Location: '/' });
			// context.res.end();
		}
	}
};

export default Cancel;
