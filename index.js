'use strict';

const https = require('https');
const querystring = require('querystring');

exports.handler = (event, context, callback) => {
    console.log('EVENT:', event);
    var event_data = JSON.parse(event.body);
    console.log('EVENT:', JSON.stringify(event_data));
    const messageData = event_data.events && event_data.events[0];
    console.log("TEST:" + JSON.stringify(messageData.message.text));
    var id = messageData.source.userId;
    if(messageData.source.groupId != null && messageData.source.groupId.length > 0){ //グループからのメッセージ
        id = messageData.source.groupId;
    }

    if(!check(messageData.message.text)){
        callback(null, 'Success!');
        return;
    }
    var postData = JSON.stringify(
    {
        "messages": [{
            "type": "text",
            "text": getResponseMessage(messageData.message.text)
        }],
        "to": id
    });
        // @TODO KMSで管理
    var ChannelAccessToken = process.env.CHANNEL_ACCESS_TOKEN; //チャンネル設定

    //リクエストヘッダ
    var options = {
        hostname: 'api.line.me',
        path: '/v2/bot/message/push',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': 'Bearer ' + ChannelAccessToken
            },
        method: 'POST',
    };
    console.log(JSON.stringify(options));
    //APIリクエスト
    var req = https.request(options,  function(res){
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log(body);
            context.succeed('handler complete');
        });
    }).on('error', function(e) {
        context.done('error', e);
        console.log(e);
    });

    req.on('error', function(e) {
        var message = "通知に失敗しました. LINEから次のエラーが返りました: " + e.message;
        console.error(message);
        context.fail(message);
    });

    req.write(postData);
    req.on('data', function (body) {
            console.log(body);
     });
    req.end();
    console.log("TEST:" + postData);
    callback(null, 'Success!');
};

var getResponseMessage = function(message) {
    message = message.toLowerCase();
    message = message.replace('@bot ', '');
    switch (message) {
        default:
            return message;
    }
};

var check = function(message) {
    message = message.toLowerCase();
    var pattern = '@bot ';
    return message.indexOf(pattern) === 0;
};
