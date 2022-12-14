# NodeJS-AWS-S3 연동 시스템 구축

NodeJS에서 express, aws-sdk, @aws-sdk/client-s3, dotenv, multer, multer-s3 모듈을 활용하여,

파일 업로드, 삭제 등등 CRUD 시스템을 구축해보았음. 일단 AWS S3 Public 상태에서 Test 진행하였으며,

성공적으로 동작하는 것을 확인함. 그리고 몇가지 구현하면서 맞닥뜨리고 해결했던 에러도 겸사 겸사 써보고자 한다.

## 실행방법

### 환경변수 설정

.env 환경변수 파일을 만들어서 관련 AWS S3 설정문을 세팅해주어야 한다.

아래와 같이 세팅을 해주면 되며, " {{ }} " 이 부분은 본인의 AWS S3 설정을 집어넣어주어야 함.

```
accessKeyId={{액세스키}}
secretAccessKey={{시크릿키}}
s3_bucket={{버킷이름}}
region={{리전이름}}
```

### npm 동작 순서

저장된 깃 정보를 제거해주고, npm 관련 모듈을 node_modules에 설치한다.

TypeScript로 작성되었기 때문에 npm run dev 라고 처음에 입력하면,

자바스크립트 파일로 컴파일 되는데 시간이 걸리기 때문에 에러가 날 수 있음.

그냥 그때는 중지하고 npm run dev 계속 실행시키면 정상작동함.

```
rm -rf .git
npm install
npm run dev
```

### 파일 제거 기능 동작시 Access Denied 오류

지난번 React Client - aws-sdk 연동 구현 때 깃허브에 실수로 API 액세스 Key가 노출되었던 적이 있는데,

AWS 감사하게도 Key가 자동으로 노출된 것을 알고 일부 권한에 아래와 같이 제한을 주었음.

![AWSCompromisedKeyQuarantineV2](https://user-images.githubusercontent.com/83178592/207494393-6787e504-ec66-49a8-9a16-79efe17603e0.png)

그 결과 get, post, put 요청은 다 정상작동 되었지만, 이상하게 delete요청만 실행이 안되는 access denied 오류가 발생하였던 것임.

이것을 모르고 버킷 정책 설정, 권한 수동 설정 및 IAM 연결 등등 이상한 짓을 2일 동안 한 것 같다. 다행히 지금에서야 오류를 찾아서 다행이다.

delete 기능을 정상 작동 시키려면, 위의 권한을 삭제하고, 다시 새로운 AccessKey, SecretKey를 발급 받아 실행시켜 보니

delete 기능이 정상 작동하는 것을 확인하여, Readme.md 파일에 기록 삼아 적어둔다.
