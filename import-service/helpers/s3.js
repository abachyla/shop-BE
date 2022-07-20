import S3 from 'aws-sdk/clients/s3';
import csvParser from 'csv-parser';

const BUCKET = 'rs-ab-shop-csv-5';
const { AWS_REGION } = process.env;
const s3 = new S3({ region: AWS_REGION });
const EXPIRATION_TIME = 60;

const deleteObject = async (key) => {
  await s3.deleteObject({
    Bucket: BUCKET,
    Key: key,
  }).promise();
};

const copyObject = async (fromKey, toKey) => {
  await s3.copyObject({
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${fromKey}`,
    Key: toKey,
  }).promise();
};

const moveObject = async (fromKey, toKey) => {
  console.log(`Copy into ${BUCKET}/${toKey}`);

  await copyObject(fromKey, toKey);
  console.log(`Copied into ${BUCKET}/${toKey}`);

  await deleteObject(fromKey);
  console.log(`Deleted from ${BUCKET}/${fromKey}`);
};

export const getSignedUrl = (name) => {
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    Expires: EXPIRATION_TIME,
    ContentType: 'text/csv',
  };

  return s3.getSignedUrlPromise('putObject', params);
};

export const importFile = (record) => {
  const { key } = record.s3.object;
  const params = {
    Bucket: BUCKET,
    Key: key,
  };

  console.log('Create read stream');
  const stream = s3.getObject(params).createReadStream();

  return new Promise((resolve, reject) => {
    stream
      .on('error', (error) => {
        console.log('Create stream error');
        console.log(error);

        reject(error);
      })
      .pipe(csvParser())
      .on('data', (data) => {
        console.log('Parsed data');
        console.log(data);
      })
      .on('end', async () => {
        const newKey = key.replace('uploaded', 'parsed');
        await moveObject(key, newKey);

        resolve();
      })
      .on('error', (error) => {
        console.log('Read stream error');
        console.log(error);

        reject(error);
      });
  });
};
