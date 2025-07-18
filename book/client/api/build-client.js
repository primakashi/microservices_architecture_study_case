import axios from 'axios';

const buildClient = ({ req }) => {
	if (typeof window === 'undefined') {
		// We are on the server
		// http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
		return axios.create({
			baseURL: 'http://bookva.tech/',
			headers: req.headers,
		});
	} else {
		// We must be on the browser
		return axios.create({
			baseUrl: '/',
		});
	}
};

export default buildClient;
