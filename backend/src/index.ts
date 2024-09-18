import express from 'express';
import envConfig from './config/env.config';

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(envConfig.PORT, () => {
	console.log(
		`Server started in ${envConfig.NODE_ENV} mode on host ${envConfig.HOST} and port ${envConfig.PORT}`
	);
});
