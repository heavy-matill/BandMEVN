var aws = require('aws-sdk');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports = module.exports = {
    sign: function (filename, callback) {
        var s3 = new aws.S3({ signatureVersion: 'v4', region: 'eu-central-1' });

        var params = {
            Bucket: process.env.S3_BUCKET,
            Key: filename,
            Expires: 60
        };
        s3.getSignedUrl('putObject', params, callback);
    }
};