import { NextFunction, Request, Response } from 'express';
import * as tweetRepository from '../data/tweets';

export async function getTweets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tweets = await tweetRepository.getAll();
    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
}
