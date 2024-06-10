import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
	const [errors, setErrors] = useState(null);

	const doRequest = async (props = {}) => {
		try {
			setErrors(null);
			const response = await axios[method](url, { ...body, ...props });

			if (onSuccess) {
				onSuccess(response.data);
			}

			return response.data;
		} catch (err) {
			// setErrors(
			// 	err.response?.data.errors.map(err => (
			// 		<ul>
			// 			<li className="text-red-500 " key={err.message}>
			// 				{err.message}
			// 			</li>
			// 		</ul>
			// 	))
			// );

			return err.response?.data.errors;
		}
	};

	return { doRequest, errors };
};

export default useRequest;
