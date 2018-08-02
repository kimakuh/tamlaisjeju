'use strict';
// Imported Modules ===================================================
const http = require('http')
const https = require('https');
var AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});
// ====================================================================

// API Token Values ===================================================
var rcptid = '1628604870493102';
var srvkey = 'zm3mH4vgXGr3g1gdYd%2BPOu8JqlWI1pBpzRptwsLnQfdF7v88BjPqLjwr6LFqWqJ71p%2FGrYskTTnYobuGM%2BhNsw%3D%3D';
var VERIFY_TOKEN = "my_awesome_token";
var MAP_ACCESS_TOKEN = 'AIzaSyA_Za9J7K37zE5OMkNt6cQ6RL2wgdBGx24'
var PAGE_ACCESS_TOKEN = "EAAaZBOZCNwZBEABADa9lKcdw33RInWctiiLUvSsOU1wZCCooCGPXpZAf7weWywTT60p80mwcn663MxZB7LAWRLh8laJRweS51EZCE3aqn4I0va9oPsGjWZAQz6YDwuXTiKUHgMg4AAkK4JNQ0wKy7ZCRxawJE9XkkUnzDADs7cZChhjzVbynFyamp0";
// ====================================================================

// LEX Initialization =================================================
AWS.config.region = 'us-east-1';
var lexruntime = new AWS.LexRuntime();
var userNumber = '123'; // username을 facebook handler에서 event. ~~~ 을 통해 페이스북 유저명으로 바꾸기
var params = {
    botAlias: process.env.BOT_ALIAS,
    botName: process.env.BOT_NAME,
    inputText: 'hai',
    userId: userNumber,
    sessionAttributes: {}
};
// ====================================================================

// LAMBDA Main Function(Handler) ======================================
exports.handler = (event, context, callback) => {
    //lex handler
    try {
        if (event.bot.name.startsWith('TourBot')) {
            dispatch(event, (response) => callback(null, response));
        }
    } catch (err) {
    }

    try{
        receivedPostback(event);
    }catch(err){

    }

    //facebook handler
    try {
        // process GET request
        if (event.queryStringParameters) {
            var queryParams = event.queryStringParameters;
            var rVerifyToken = queryParams['hub.verify_token']
            if (rVerifyToken === VERIFY_TOKEN) {
                var challenge = queryParams['hub.challenge']
                var response = {
                    'body': parseInt(challenge),
                    'statusCode': 200
                };
                started_button();
                callback(null, response);
            } else {
                var response = {
                    'body': 'Error, wrong validation token',
                    'statusCode': 422
                };
                callback(null, response);
            }
        } else {
            // process POST request
            var data = JSON.parse(event.body);
            if (data.object === 'page') {
                data.entry.forEach(function(entry) {
                    var pageID = entry.id;
                    var timeOfEvent = entry.time;
                    entry.messaging.forEach(function(msg) {
                        if (msg.message.quick_reply || msg.message.text) {
                            receivedMessage(msg);
                        } else {
                        }
                    });
                });
            }
            var response = {
                'body': "ok",
                'statusCode': 200
            };
            callback(null, response);
        }
    } catch (err) {
    }
}
// ====================================================================

// Facebook Send API ==================================================
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    var messageId = message.mid;
    var messageText;

    try{
        console.log(message["postbakc"]["payload"]);
    } catch(err){

    }
    try {
        messageText = message["quick_reply"]["payload"];
    } catch (err) {
        messageText = message.text;
    }
    var messageAttachments = message.attachments;
    if (messageText) {
        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'generic':
                //sendGenericMessage(senderID);
                break;
            default:
                // sendTextMessage(senderID, messageText);
                params["inputText"] = messageText;
                params["userId"] = senderID;
                lexruntime.postText(params, function(err, data) {
                    if (err) {
                    } else { // successfully send facebook -> lambda -> lex
                    }
                });
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);
}

function getJson(url, callback) {
    http.get(url, function(res) {
        var body = '';

        // http 주소상에 있는 json data를 그냥 문자열 그대로 chunk 단위로 가져옴
        res.on('data', function(chunk) {
            body += chunk;
        });

        // 가져온 string 값을 json parse작업을 통해 json으로써 받음
        res.on('end', function() {
            var response = JSON.parse(body);
            callback(response);
        });
    }).on("error", (err) => {
    });
}

function buildURL(contentsTypeName, siGunGu, category1, category2, category3) {
    var contentsTypeID = {
        'transportation': '77',
        'hotel': '80',
        'festival': '85',
        'food': '82',
        'attraction': '76'
    };
    var pageNo = 1,
        numOfRows = 9;
    var url = 'http://api.visitkorea.or.kr/openapi/service/rest/EngService/areaBasedList?' + 'ServiceKey=' + srvkey +
        '&contentTypeId=' + contentsTypeID[contentsTypeName] +
        '&areaCode=1&sigunguCode=' + siGunGu +
        '&cat1=' + category1 + '&cat2=' + category2 + '&cat3=' + category3 +
        '&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=A' +
        '&numOfRows=' + numOfRows.toString() +
        '&pageNo=' + pageNo.toString() +
        '&_type=json';
    return url;
}

// FACEBOKK에 보내는 함수인듯.
function callSendAPI(messageData) {
    var body = JSON.stringify(messageData);
    var path = '/v2.6/me/messages?access_token=' + PAGE_ACCESS_TOKEN;
    var options = {
        host: "graph.facebook.com",
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var callback = function(response) {
        var str = ''
        response.on('data', function(chunk) {
            str += chunk;
        });
        response.on('end', function() {

        });
    }
    var req = https.request(options, callback);
    req.on('error', function(e) {
    });

    req.write(body);
    req.end();
}

function started_button() {
    var messageData = {
        setting_type: "call_to_actions",
        thread_state: "new_thread",
        call_to_actions: [{
            payload: "hi"
        }]
    };
    callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };
    callSendAPI(messageData);
}

function sendButtonMessage(recipientId, messageText) {
    var messageData = {
        "recipient": {
            "id": recipientId
        },
        "message": {
            "text": messageText,
            "quick_replies": [{
                    "content_type": "text",
                    "title": "Hotel",
                    "payload": "hotel",
                },
                {
                    "content_type": "text",
                    "title": "Festival",
                    "payload": "festival",
                },
                {
                    "content_type": "text",
                    "title": "Food",
                    "payload": "food",
                },
                {
                    "content_type": "text",
                    "title": "Attraction",
                    "payload": "attraction",
                }
            ]
        }
    };
    callSendAPI(messageData);
}

function sendLocationMessage(recipientId, latitude, longitude) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: 'Location Shared By Bot',
                        subtitle: "Location",
                        image_url: 'https://maps.googleapis.com/maps/api/staticmap?key=' + MAP_ACCESS_TOKEN +
                            "&markers=color:red|label:B|" + latitude + "," + longitude + "&size=360x360&zoom=13"
                    }]
                }
            }
        }
    }
    callSendAPI(messageData);
}


function sendGenericMessage(recipientId, contentsTypeName, siGunGu, category1, category2, category3) {
    var contentsCards;
    var mydata = getJson(buildURL(contentsTypeName, siGunGu, category1, category2, category3), function(res) {
        var data = res.response.body.items.item;
        contentsCards = null;
        if (data != null) {
            contentsCards = []
            for (var i = 0; i < data.length && i < 9; i++) {
                contentsCards.push({
                    title: data[i]['title'],
                    subtitle: data[i]['addr1'],
                    item_url: "https://www.oculus.com/en-us/rift/",
                    image_url: data[i]['firstimage'],
                    buttons: [{
                            type: "phone_number",
                            title: "Call Representative",
                            payload: "+821085675088",
                            //payload: data[i]['tel'],
                        },
                        {
                            type: "postback",
                            title: "select",
                            payload: data[i]['title']
                        }
                        /*
                        , {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble",
                        }
                        */
                    ],
                });
            }
            contentsCards.push({
                title: "View More Contents",
                subtitle: "Click for more information",
                buttons: [{
                    type: "postback",
                    title: "Click Here!",
                    payload: "123"
                    //payload: "More&Page2&" + contentsTypeName + "&" + siGunGu + "&" + category1 + "&" + category2 + "&" + category3,
                }],
            });
            var messageData = {
                recipient: {
                    id: recipientId
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "generic",
                            elements: contentsCards,
                        }
                    }
                }
            };
            callSendAPI(messageData);
        } else {
            sendTextMessage(rcptid, "Not Found.");
        }
    });
}

// LEX API ============================================================
function buildResponseCard(title, subTitle, options) {
    let buttons = null;
    if (options !== null) {
        buttons = [];
        for (let i = 0; i < Math.min(5, options.length); i++) {
            buttons.push(options[i]);
        }
    }
    return {
        contentType: 'application/vnd.amazonaws.card.generic',
        version: 1,
        genericAttachments: [{
            title,
            subTitle,
            buttons,
        }],
    };
}

function buildMessage(messageContent) {
    return {
        contentType: 'PlainText',
        content: messageContent,
    };
}

function close(sessionAttributes, fulfillmentState, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
            responseCard,
        },
    };
}

function confirmIntent(sessionAttributes, intentName, slots, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            intentName,
            slots,
            message,
            responseCard,
        },
    };
}

function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
            responseCard,
        },
    };
}
// ====================================================================

// LEX INTENTS ========================================================
function beginIntent(intentRequest, callback) {
    const outputSessionAttributes = intentRequest.sessionAttributes;
    const source = intentRequest.invocationSource;
    const name = intentRequest.currentIntent.name;

    if (source === 'DialogCodeHook') {
        // perform validation on the slot values we have
        const slots = intentRequest.currentIntent.slots;
        const meeting = (slots.Meeting ? slots.Meeting : null);
        const type = (slots.Type ? slots.Type : null);

        if (meeting !== null && type === null) {
            //sendGenericMessage(rcptid, 'hotel', '', '', '', '');
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'Type', buildMessage('haiejflwijfiodijaiji eijfeifjwfh')));
            sendButtonMessage('1628604870493102', "Why don't you choose one of these? (Attraction, Hotel, Food, Festival/Event)");
        }
        if (meeting !== null && type === 'hotel') {
            sendTextMessage('1628604870493102', 'Which hotel type do you want? (Korean Traditional Hotel, hanOk, Benikia, goodstay)');
            callback(elicitSlot(outputSessionAttributes, "Hotel", {
                "HotelBegin": "hotel",
                "HotelType": null,
                "WhetherPosition": null,
                "CurrentPosition": null,
                "SiGunGu": null
            }, "HotelType", buildMessage('Which hotel type do you want? (Korean Traditional Hotel, hanOk, Benikia, goodstay)')));
        }
        if (meeting !== null && type === 'festival') {
            sendTextMessage('1628604870493102', 'What kind of festival do you want?');
            callback(elicitSlot(outputSessionAttributes, "Festival", {
                "FestivalBegin": "festival",
                "FestivalType": null,
                "EventStartDate": null
            }, "FestivalType", buildMessage('What kind of festival do you want?')));
        }
        if (meeting !== null && type === 'food') {
            sendTextMessage('1628604870493102', 'Do you know food name? or Food type');
            callback(elicitSlot(outputSessionAttributes, "Food", {
                "FoodBegin": "food",
                "FoodName": null,
                "FoodType": null,
                "WhetherPosition": null,
                "CurrentPosition": null,
                "SiGunGu": null
            }, "FoodType", buildMessage('Do you know food name? or Food type?????')));
        }
        if (meeting !== null && type === 'attraction') {
            sendTextMessage('1628604870493102', 'Which type do you want? (cultural Facilities, architectural sights, architectural sights, industrial sites, Historical sites, Recreational Sites, Experience Programs)');
            callback(elicitSlot(outputSessionAttributes, "Attraction", {
                "AttractionBegin": "attraction",
                "AttractionType": null,
                "WhetherPosition": null,
                "CurrentPosition": null,
                "SiGunGu": null
            }, "AttractionType", buildMessage('Which type do you want? (cultural Facilities, architectural sights, architectural sights, industrial sites, Historical sites, Recreational Sites, Experience Programs)')));
        }
    }
}

function hotelIntent(intentRequest, callback) {
    const outputSessionAttributes = intentRequest.sessionAttributes;
    const source = intentRequest.invocationSource;
    const name = intentRequest.currentIntent.name;

    if (source === 'DialogCodeHook') {
        // perform validation on the slot values we have
        const slots = intentRequest.currentIntent.slots;
        const hotelBegin = (slots.HotelBegin ? slots.HotelBegin : null);
        const hotelType = (slots.HotelType ? slots.HotelType : null);
        const whetherPosition = (slots.WhetherPosition ? slots.WhetherPosition : null);
        const currentPosition = (slots.CurrentPosition ? slots.CurrentPosition : null);
        const siGunGu = (slots.SiGunGu ? slots.SiGunGu : null);

        if (hotelType !== null && whetherPosition === null) {
            sendTextMessage('1628604870493102', 'Do you want current position hotel or another location?');
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'WhetherPosition', buildMessage('aa')));
        }
        if (whetherPosition === 'current position' && currentPosition === null) {
            sendGenericMessage(rcptid, 'hotel', '', '', '', '');
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'CurrentPosition', buildMessage('aa')));
        }
        if (whetherPosition === 'sigungu' && siGunGu === null) {
            sendTextMessage('1628604870493102', 'ok Input si gun gu');
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'SiGunGu', buildMessage('ok input si, gun, gu')));
        }
        if (hotelBegin == 'hotel' && hotelType !== null && (whetherPosition === 'no' || currentPosition !== null || siGunGu !== null)) {
            sendGenericMessage(rcptid, 'hotel', '', '', '', '');
            callback(close(outputSessionAttributes, "Fulfilled"));
        }
    }
}

function festivalIntent(intentRequest, callback) {
    const outputSessionAttributes = intentRequest.sessionAttributes;
    const source = intentRequest.invocationSource;
    const name = intentRequest.currentIntent.name;

    if (source === 'DialogCodeHook') {
        // perform validation on the slot values we have
        const slots = intentRequest.currentIntent.slots;
        const festivalBegin = (slots.FestivalBegin ? slots.FestivalBegin : null);
        const festivalType = (slots.FestivalType ? slots.FestivalType : null);
        const eventStartDate = (slots.EventStartDate ? slots.EventStartDate : null);

        if (festivalType !== null && eventStartDate === null) {
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'EventStartDate', buildMessage('Which date do you plan to enjoy festival?')));
        }
        if (festivalType !== null && eventStartDate !== null && festivalBegin !== null) {
            callback(close(outputSessionAttributes, "Fulfilled", buildMessage('Ok all done! you choose ' + festivalType + ' and start date is' + eventStartDate + '!')));
        }
    }
}

function foodIntent(intentRequest, callback) {
    const outputSessionAttributes = intentRequest.sessionAttributes;
    const source = intentRequest.invocationSource;
    const name = intentRequest.currentIntent.name;

    if (source === 'DialogCodeHook') {
        // perform validation on the slot values we have
        const slots = intentRequest.currentIntent.slots;
        const foodBegin = (slots.FoodBegin ? slots.FoodBegin : null);
        const foodName = (slots.FoodName ? slots.FoodName : null);
        const foodType = (slots.FoodType ? slots.FoodType : null);
        const whetherPosition = (slots.WhetherPosition ? slots.WhetherPosition : null);
        const currentPosition = (slots.CurrentPosition ? slots.CurrentPosition : null);
        const siGunGu = (slots.SiGunGu ? slots.SiGunGu : null);

        if ((foodName !== null || foodType !== null) && whetherPosition === null) {
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'WhetherPosition', buildMessage('Do you want current position food or another location?')));
        }
        if (whetherPosition === 'current position' && currentPosition === null) {
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'CurrentPosition', buildMessage('ok Detecting current position')));
        }
        if (whetherPosition === 'sigungu' && siGunGu === null) {
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'SiGunGu', buildMessage('ok input si, gun, gu')));
        }
        if (foodBegin == 'Food' && foodType !== null && (whetherPosition === 'no' || currentPosition !== null || siGunGu !== null)) {
            callback(close(outputSessionAttributes, "Fulfilled", buildMessage('Ok all done! you choose ' + foodType + '!')));
        }
    }
}

function attractionIntent(intentRequest, callback) {
    const outputSessionAttributes = intentRequest.sessionAttributes;
    const source = intentRequest.invocationSource;
    const name = intentRequest.currentIntent.name;

    if (source === 'DialogCodeHook') {
        // perform validation on the slot values we have
        const slots = intentRequest.currentIntent.slots;
        const attractionBegin = (slots.AttractionBegin ? slots.AttractionBegin : null);
        const attractionType = (slots.AttractionType ? slots.AttractionType : null);
        const whetherPosition = (slots.WhetherPosition ? slots.WhetherPosition : null);
        const currentPosition = (slots.CurrentPosition ? slots.CurrentPosition : null);
        const siGunGu = (slots.SiGunGu ? slots.SiGunGu : null);

        if (attractionType !== null && whetherPosition === null) {
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'WhetherPosition', buildMessage('Do you want current position hotel or another location?')));
        }
        if (whetherPosition === 'current position' && currentPosition === null) {
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'CurrentPosition', buildMessage('ok Detecting current position')));
        }
        if (whetherPosition === 'sigungu' && siGunGu === null) {
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, 'SiGunGu', buildMessage('ok input si, gun, gu')));
        }
        if (attractionBegin == 'Attraction' && attractionType !== null && (whetherPosition === 'no' || currentPosition !== null || siGunGu !== null)) {
            callback(close(outputSessionAttributes, "Fulfilled", buildMessage('Ok all done! you choose ' + attractionType + '!')));
        }
    }
}

function dispatch(intentRequest, callback) {
    const name = intentRequest.currentIntent.name;
    // dispatch to the intent handlers
    if (name === 'Attraction') {
        return attractionIntent(intentRequest, callback);
    } else if (name === 'Begin') {
        return beginIntent(intentRequest, callback);
    } else if (name === 'Festival') {
        return festivalIntent(intentRequest, callback);
    } else if (name === 'Food') {
        return foodIntent(intentRequest, callback);
    } else if (name === 'Hotel') {
        return hotelIntent(intentRequest, callback);
    } else {
        throw new Error(`Intent with name ${name} not supported`);
    }
}
// ====================================================================