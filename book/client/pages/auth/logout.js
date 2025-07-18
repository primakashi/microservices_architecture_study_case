import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const Logout = ({ setCartTotal }) => {
	const { doRequest } = useRequest({
		url: '/api/users/signout',
		method: 'post',
		body: {},
		onSuccess: () => {
			setCartTotal(null);
			Router.push('/');
		},
	});

	useEffect(() => {
		doRequest();
	}, []);

	return <div>Signing you out...</div>;
};

export default Logout;
