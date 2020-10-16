const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    endpoint: "dynamodb.us-east-1.amazonaws.com"
});

let docClient = new AWS.DynamoDB.DocumentClient();

const getShortLink = (code, callback) => {    
    var params = {
        TableName: "SMS_Shortener",
        KeyConditionExpression: "#code = :code",
        ExpressionAttributeNames:{
            "#code": "code"
        },
        ExpressionAttributeValues: {
            ":code":code
        }
    };
    docClient.query(params, callback);
};

const updateClicks = (params, callback) => {
    var params = {
        TableName: 'SMS_Shortener',
        Key: {
          'code' : params.code,
          'uri' : params.uri
        },
        UpdateExpression: 'ADD clicks :t',
        ExpressionAttributeValues: {
          ':t' : 1
        }
    };
    docClient.update(params, callback);
};

const getClicks = (code, callback) => {    
    var params = {
        TableName: "SMS_Shortener",
        KeyConditionExpression: "#code = :code",
        ExpressionAttributeNames:{
            "#code": "code"
        },
        ExpressionAttributeValues: {
            ":code":code
        }
    };
    docClient.query(params, callback);
};

module.exports = {
    getShortLink, updateClicks, getClicks
};
