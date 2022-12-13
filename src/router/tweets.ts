import express from 'express';
import * as tweetController from '../controller/tweets';

const router = express.Router();

router.get('/', tweetController.getTweets);

export default router;
