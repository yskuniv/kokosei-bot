'use strict';

const https = require('https');

exports.handler = (event, context, callback) => {
    console.log('EVENT:', event);
    const messageData = event.events && event.events[0];
    console.log("TEST:" + JSON.stringify(messageData.message.text));
    var id = messageData.source.userId;
    if(messageData.source.groupId != null && messageData.source.groupId.length > 0){ //グループからのメッセージ
        id = messageData.source.groupId;
    }

    var responseMessages = [
        "かんちがいしないでよね",
        "かってにしなさいよ",
        "もうしらないんだから",
        "ちょっとだけよ",
    ];

    var kokuRandom = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 5.0;

    const responseMessage = responseMessages[Math.floor(kokuRandom * responseMessages.length)];

    var postData = JSON.stringify(
    {
        "messages": [{
            "type": "text",
            "text": responseMessage
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
