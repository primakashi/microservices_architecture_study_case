import Head from 'next/head';
import Link from 'next/link';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';

const OrderItem = ({ order }) => {
	let { t } = useTranslation();

	const date = new Intl.DateTimeFormat('ru-RU', {
		dateStyle: 'medium',
	}).format(Date.parse(order.createdAt));

	const amount_total = order.cart
		.map(item => item.price * item.quantity)
		.reduce((a, b) => a + b, 0);

	return (
		<div className="lg:block mt-6 mb-10 shadow sm:rounded-md sm:overflow-hidden ring-1 ring-gray-200">
			<div className=" px-4 py-5 bg-white space-y-6 sm:p-6 border-b border-gray-200">
				<div className="grid grid-cols-4 ">
					<div className="flex flex-col col-span-4 lg:col-span-1">
						<a className="font-medium">{t('orders:orderId')}</a>
						<a>{order.id}</a>
					</div>
					<div className="flex flex-col  col-span-2 lg:col-span-1">
						<a className="font-medium">{t('orders:date_placed')}</a>
						<a>{date}</a>
					</div>
					<div className="flex flex-col text-right lg:text-left col-span-2 lg:col-span-1">
						<a className="font-medium">{t('orders:amount_total')}</a>
						<a>
							{'$'}
							{amount_total / 100}
						</a>
					</div>
					<div className="  col-span-4  lg:col-span-1 text-right">
						{order.receipt_url && (
							<Link href={order.receipt_url}>
								<a
									target="_blank"
									rel="noopener noreferrer"
									className="w-full lg:w-2/3 flex  justify-center lg:inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									{t('orders:view_invoice')}
								</a>
							</Link>
						)}
					</div>
				</div>
			</div>
			{_.map(order.cart, product => {
				return (
					<div key={product.itemId}>
						<div className=" px-4  bg-white">
							<li className="py-6 flex">
								<div className="flex-shrink-0 w-28 h-28  rounded-md overflow-hidden">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-center object-cover"
									/>
								</div>

								<div className="ml-4 flex-1 flex flex-col">
									<div>
										<div className="flex justify-between text-base ">
											<h3 className="flex flex-col">
												<Link href={`/${product.category}/${product.itemId}`}>
													<a className="font-medium text-gray-900">
														{product.name}
													</a>
												</Link>
												<a className="hidden lg:block text-base text-gray-400">
													{product.description}
												</a>
											</h3>
											<p className="ml-4">
												{'$'}
												{product.price / 100}
											</p>
										</div>
									</div>
									<div className="flex-1 flex items-end justify-between ">
										<p className="text-gray-400">
											{t('orders:quantity')} {product.quantity}
										</p>
									</div>
								</div>
							</li>
						</div>
						<div className="px-4 py-3 flex justify-between   border-b border-gray-200">
							{order.payment_status === 'succeeded' ? (
								<div className="inline-flex">
									<CheckCircleIcon
										className="h-6 w-6 text-green-700 mr-2"
										aria-hidden="true"
									/>
									{t('orders:paid')}
								</div>
							) : (
								<div className="inline-flex">
									<XCircleIcon
										className="h-6 w-6 text-red-700 mr-2"
										aria-hidden="true"
									/>
									{t('orders:canceled')}
								</div>
							)}

							<Link href={`/${product.category}/${product.itemId}`}>
								<a className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
									{t('orders:view_product')}
								</a>
							</Link>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default OrderItem;
