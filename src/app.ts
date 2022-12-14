import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import AWS from "aws-sdk";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const app = express();
console.log(process.env.region);

const BUCKET_NAME = `${process.env.s3_bucket}`;
const region = `${process.env.region}`;
const accessKeyId = `${process.env.accessKeyId}`;
const secretAccessKey = `${process.env.secretAccessKey}`;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
});

const S3_Bucket = new AWS.S3({
  region,
});

const S3_Bucket_Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

const upload = multer({
  storage: multerS3({
    s3: S3_Bucket_Client,
    acl: "public-read",
    bucket: `${BUCKET_NAME}`,
    key: function (req, file, cb) {
      console.log(file);
      const uid = new Date().valueOf();
      cb(null, `${uid}_${file.originalname}`);
    },
  }),
});

const corsOpt = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOpt));
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

app.post(
  "/upload",
  upload.single(`file`),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      res.status(201).json(req.file?.location);
      // location은 타입 정의에 빠져있어 node_modules에 내가 추가하였음
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

app.get("/list", async (req: Request, res: Response, next: NextFunction) => {
  try {
    S3_Bucket.listObjectsV2({ Bucket: `${BUCKET_NAME}` }, (error, list) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(list.Contents);
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get(
  "/download/:filename",
  async (req: Request, res: Response, next: NextFunction) => {
    const fileType = req.params.filename.split(".")[1];
    if (fileType == null) {
      try {
        S3_Bucket.getObject(
          { Bucket: `${BUCKET_NAME}`, Key: `${req.params.filename}` },
          (error, data) => {
            if (error) {
              res.status(400).json(error);
            } else {
              const decoded = decodeURIComponent(`${data.Body?.toString()}`);
              res.status(200).json(decoded);
            }
          }
        );
      } catch (error) {
        res.status(400).json(error);
      }
    } else {
      try {
        S3_Bucket.getObject(
          { Bucket: `${BUCKET_NAME}`, Key: `${req.params.filename}` },
          (error, data) => {
            if (error) {
              res.status(400).json(error);
            } else {
              // image buffer transformed into url
              // @ts-ignore
              const b64 = Buffer.from(data.Body).toString("base64");
              const mimeType = "image/jpg";
              const base64Url = `data:${mimeType};base64,${b64}`;
              // image buffer transformed into base64Url, imgHTML
              const imgHTML = decodeURIComponent(
                `<img src=${base64Url}`.toString()
              );
              res.status(200).json(imgHTML);
            }
          }
        );
      } catch (error) {
        res.status(400).json(error);
      }
    }
  }
);

app.delete(
  "/delete/:filename",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      S3_Bucket.deleteObject(
        {
          Bucket: `${BUCKET_NAME}`,
          Key: `${req.params.filename}`,
        },
        (error, data) => {
          if (error) {
            console.log(error);
            res.status(403).json("Access Denied!!");
          } else {
            console.log(data);
            res.status(200).json(data);
          }
        }
      );
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// S3Client 모듈로 삭제기능 구현
// app.delete(
//   "/delete/:filename",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = await S3_Bucket_Client.send(
//         new DeleteObjectCommand({
//           Bucket: BUCKET_NAME,
//           Key: req.params.filename,
//         })
//       );
//       console.log(data);
//       res.status(200).json(data);
//     } catch (error) {
//       res.status(400).json(error);
//     }
//   }
// );

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong!";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Hi Seong Eun Lee!");
  console.log("Started!");
});
