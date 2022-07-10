var aws = require('aws-sdk');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports = module.exports = {
    sign: function (filename, operation, callback) {
        var s3 = new aws.S3({ signatureVersion: 'v4', region: 'eu-central-1' });

        var params = {
            Bucket: process.env.S3_BUCKET,
            Key: filename,
            Expires: 60*60
        };
        console.log(params)
        s3.getSignedUrl(operation, params, callback);
    },

    signPut: function (filename, callback) {
        return this.sign(filename, 'putObject', callback);
    },

    signGet: function (filename, callback) {
        
        console.log(params)
        return this.sign(filename, 'getObject', callback);
    }
};