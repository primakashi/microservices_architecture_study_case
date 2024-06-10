import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import _ from 'lodash';
import useRequest from '../hooks/use-request';
import Modal from './Modal';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const CartItem = ({ product, total, setTotal, cartTotal, setCartTotal }) => {
	let { t } = useTranslation();

	const [qty, setQty] = useState(product.quantity);
	const [open, setOpen] = useState(false);
	const [showComponent, setShowComponent] = useState(true);

	const QtySelectRange = _.range(1, 11);
	// => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

	const updateQty = useRequest({
		url: `/api/cart/${product.id}`,
		method: 'put',
		onSuccess: ({ quantity, price }) => {
			const qtyRef = qty;
			setQty(quantity);

			const sum = total - qtyRef * price;

			setTotal(sum + quantity * price);
		},
	});

	const remove = useRequest({
		url: `/api/cart/${product.id}`,
		method: 'delete',
		onSuccess: () => {
			setOpen(false);
			setShowComponent(false);
			setCartTotal(cartTotal - 1);
		},
	});

	const ModalRemove = {
		header: `${t('cart:modal_header')}`,
		body: `${t('cart:modal_body')}`,
		left: `${t('cart:modal_left_button')}`,
		right: `${t('cart:modal_right_button')}`,
	};

	const QtySelector = (
		<Menu as="div">
			<Menu.Button className="inline-flex justify-start w-16 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
				{qty}
				<ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
			</Menu.Button>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute mt-2 w-16  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
					<div className="py-1 ">
						{_.map(QtySelectRange, select => {
							return (
								<Menu.Item key={select}>
									{({ active }) => (
										<a
											onClick={() => {
												updateQty.doRequest({ quantity: select });
											}}
											className={classNames(
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
												select === qty
													? 'bg-gray-100 text-gray-900'
													: 'text-gray-700',
												'block px-4 py-2 text-sm '
											)}
										>
											{select}
										</a>
									)}
								</Menu.Item>
							);
						})}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);

	return (
		<>
			<Modal
				status={open}
				handleClose={setOpen}
				modalHeader={ModalRemove.header}
				modalBody={ModalRemove.body}
				modalLeftButton={ModalRemove.left}
				modalRightButton={ModalRemove.right}
				modalRightButtonAction={remove.doRequest}
			/>
			{showComponent && (
				<li className="py-6 flex">
					<div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
						<img
							src={product.image}
							alt={product.name}
							className="w-full h-full object-center object-cover"
						/>
					</div>

					<div className="ml-4 flex-1 flex flex-col">
						<div>
							<div className="grid grid-cols-6 gap-2 text-base font-medium text-gray-900">
								<h3 className="col-span-5">
									<Link href={`/${product.category}/${product.itemId}`}>
										<a target="_blank" rel="noopener noreferrer">
											{product.name}
										</a>
									</Link>
								</h3>
								<div className="col-span-1 justify-self-end">{QtySelector}</div>
							</div>
							<p className="mt-1 text-sm text-gray-500">
								{'$'}
								{product.price / 100}
							</p>
						</div>
						<div className="flex-1 flex items-end justify-between text-sm">
							<p className="text-gray-500">
								{t('cart:quantity')} {qty}
							</p>

							<div className="flex">
								<button
									type="button"
									onClick={() => setOpen(true)}
									className="font-medium text-indigo-600 hover:text-indigo-500"
								>
									{t('cart:remove')}
								</button>
							</div>
						</div>
					</div>
				</li>
			)}
		</>
	);
};

export default CartItem;
