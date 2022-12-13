import express from 'express';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEST: string;
    }
  }

  namespace Express {
    interface Request {
      user?: Record<Object | String>;
    }
  }
}

// 내가 임의로 만든 정의.
// declare global로 기존에 정의되어있던
// 인터페이스를 확장했음.
