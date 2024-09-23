import express from 'express';
import cors from 'cors';

import env from '@/config/env';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(env.PORT, () => {
	console.log(
		`Server started in ${env.NODE_ENV} mode on host ${env.HOST} and port ${env.PORT}`
	);
});
