const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create S3 instance
const s3 = new AWS.S3();

module.exports = {
  s3,
  bucketName: process.env.AWS_BUCKET_NAME
};