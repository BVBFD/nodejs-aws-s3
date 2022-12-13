type TweetData = {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
};

type Tweet = TweetData & {
  username?: string;
  name?: string;
  url?: string;
};

const tweets: Tweet[] = [
  {
    id: '1',
    text: '안녕 이건 첫번째 트윗이야',
    createdAt: new Date(),
    name: 'Truyu',
    username: 'truyu',
    url: `https://image.ytn.co.kr/general/jpg/2021/0129/202101291422189048_d.jpg`,
    userId: '1',
  },
  {
    id: '2',
    text: '안녕 이건 두번째 트윗이야',
    createdAt: new Date(),
    name: 'Jeong Yeon',
    username: 'jeong yeon',
    url: `https://dimg.donga.com/wps/NEWS/IMAGE/2021/12/21/110883509.2.jpg`,
    userId: '2',
  },
];

export async function getAll(): Promise<Tweet[]> {
  return tweets;
}
