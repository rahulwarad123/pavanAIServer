
var q = require('q');

var AlexaSkillUtil = require('./alexaSkillUtil.js');
var TidePooler = require('./../../apps/tide-pooler/tide-pooler.js');
var Response = require('./../../shared/data-models/response.js');
var Speech = require('./../../shared/data-models/speech.js');
var aos = require('./../../apps/aos/aos.js');

var Allstate = function () { };


//public function start
Allstate.prototype.execute = function (body) {
    var responseInfo = new Response();
    var deferred = q.defer();
    try {
        checkAppId(body.session.application.applicationId);
        if (!body.session.attributes) {
            body.session.attributes = {};
        }
        if (body.session.new) {
            onSessionStarted(body);
        }

        HandleRequest(body)
            .then(function (respData) {
                responseInfo.data = respData;
                deferred.resolve(responseInfo);
            })
            .catch(function () {
                logging("Unexpected exception " + error);
                responseInfo.status = 1;
                deferred.reject(responseInfo);
            });

    } catch (error) {
        logging("Unexpected exception " + error);
        responseInfo.status = 1;
        deferred.reject(responseInfo);
    }
    return deferred.promise;
};

//public function end

//private function start
function HandleRequest(body) {
    var deferred = q.defer();
    var handleRequestRespInfo;
    switch (body.request.type) {
        case 'LaunchRequest':
            HandleLaunchRequest(body, deferred)
                .then(function (output) {
                    handleRequestRespInfo = output;
                    deferred.resolve(handleRequestRespInfo);
                });
            break;
        case 'SessionEndedRequest':
            HandleSessionEndedRequest(body, deferred)
                .then(function (output) {
                    handleRequestRespInfo = output;
                    deferred.resolve(handleRequestRespInfo);
                });
            break;
        case 'IntentRequest':
        default:
            logging('dispatch intent: ' + body.request.intent.name);
            HanldeIntentRequest(body, deferred)
                .then(function (output) {
                    handleRequestRespInfo = output;
                    deferred.resolve(handleRequestRespInfo);
                });
            break;
    }
    return deferred.promise;
}

function HandleLaunchRequest(body, deferred) {
    logging("onLaunch requestId: " + body.request.requestId + ", sessionId: " + body.session.sessionId);
    return handleWelcomeRequest(body, deferred);
}

function handleWelcomeRequest(body, deferred) {
    var speechOutput = new Speech();
    speechOutput.text = "Welcome to Allstate. How can I help?";

    var repromptOutput = new Speech();
    repromptOutput.text = "Hello! Welcome to Allstate. How can I help?" +
        "I can provide information about your Allstate Account or " +
        " provide insurance. " +
        "I can even help you with Road Side Assistance.";
    var welcomeResponseInfo = AlexaSkillUtil.ask(speechOutput, repromptOutput, body.session);
    deferred.resolve(welcomeResponseInfo);
    return deferred.promise;
}

function HandleSessionEndedRequest(body, deferred) {
    logging("onSessionEnded requestId: " + body.request.requestId
        + ", sessionId: " + body.session.sessionId);
    // any cleanup logic goes here
    deferred.resolve();
    return deferred.promise;
}

function HanldeIntentRequest(body, deferred) {
    var intentResponseInfo;
    checkBodyAttributes(body);
    checkAndUpdateIntentSequence(body);
    var intentName = body.request.intent.name;
    switch (intentName.toUpperCase()) {
        case "AGENTFIND":
            handleAgentFindIntent(body, deferred)
                .then(function (output) {
                    intentResponseInfo = output;
                    deferred.resolve(intentResponseInfo);
                });
            break;
        case "AGENTFINDBYZIP":
            handleAgentFindByZipIntent(body, deferred)
                .then(function (output) {
                    intentResponseInfo = output;
                    deferred.resolve(intentResponseInfo);
                });
            break;
        case "AGENTFINDEMAILYES":
            handleAgentFindEmailYesIntent(body, deferred)
                .then(function (output) {
                    intentResponseInfo = output;
                    deferred.resolve(intentResponseInfo);
                });
            break;
        case "AOSRENTERSINSURANCE":
            handlerAOSRentersInsuranceIntent(body, deferred)
                .then(function (output) {
                    intentResponseInfo = output;
                    deferred.resolve(intentResponseInfo);
                });
            break;
        case "AOSRENTERSNAME":
        case "AOSRENTERSLASTNAME":
            handlerAOSRentersInsuranceName(body, deferred)
                .then(function (output) {
                    intentResponseInfo = output;
                    deferred.resolve(intentResponseInfo);
                })
            break;
        case "AOSRENTERSDOB":
            handlerAOSRentersInsuranceDOB(body, deferred)
                .then(function (output) {
                    intentResponseInfo = output;
                    deferred.resolve(intentResponseInfo);
                })
            break;
        default:
            deferred.reject("Sorry. I am still learning. For now I can't help you with this.");
            break;
    }
    return deferred.promise;
}

function onSessionStarted(body) {
    logging("onSessionStarted requestId: " + body.request.requestId
        + ", sessionId: " + body.session.sessionId);
}

function logging(data) {
    if (false) {
        console.log(data);
    }
}

function checkAppId(currentReqAppId) {
    var appId = "amzn1.ask.skill.1cf6d2e2-8f52-4e41-b540-d6328404d0a4";
    if (this._appId && currentReqAppId !== appId) {
        logging("The applicationIds don't match : " + currentReqAppId + " and " + appId);
        throw "Invalid applicationId";
    }
}

// private intents functions start
function updateCorrectIntent(body, nextIntentName) {
    body.request.intent.name = nextIntentName
    var currentSlots = body.request.intent.slots;
    var newSlots = {};
    //write switch case to set currentIntent slot values to previous intent slot value.
    switch (nextIntentName.toUpperCase()) {
        case "AGENTFINDBYZIP":
            newSlots.agent_zip = { "name": "agent_zip", "value": currentSlots.slotOne.value };
            break;
        case "AOSRENTERSNAME":
            newSlots.firstName = { "name": "firstName", "value": currentSlots.slotOne ? currentSlots.slotOne.value : undefined };
            newSlots.lastName = { "name": "lastName", "value": currentSlots.slotTwo ? currentSlots.slotTwo.value : undefined };
            break;
        default:
            break;
    };
    body.request.intent.slots = newSlots;
}

function checkBodyAttributes(body) {
    if (!body.attributes) {
        body.attributes = [];
    }
}

function checkAndUpdateIntentSequence(body) {
    var curIntentName = body.request.intent.name;
    var intentSeq = body.session.attributes['intentsequence'];
    if (curIntentName) {
        if (curIntentName.toLowerCase().indexOf('general') > -1 &&
            body.session.attributes && body.session.attributes.predictedIntent) {
            updateCorrectIntent(body, body.session.attributes.predictedIntent);
        }
        curIntentName = body.request.intent.name;//update the current intent name after intent has been corrected.
        if (intentSeq) {
            intentSeq = intentSeq + "|" + curIntentName.toUpperCase();
        } else {
            intentSeq = curIntentName.toUpperCase();
        }
        body.session.attributes['intentsequence'] = intentSeq;
    }
}

function supportedCitiesIntent(body) {
    var poolerSpeechResponse = TidePooler.getSupportedCitiesResponse();
    var supCitiesResponseInfo = AlexaSkillUtil.ask(
        poolerSpeechResponse.speechOutput,
        poolerSpeechResponse.repromptOutput,
        body.session
    );
    return supCitiesResponseInfo;
}

function dialogTideIntent(body, deferred) {
    var dialogTideSpeechResponse;
    var intent = body.request.intent;
    var citySlotValue = intent.slots.td_city ? intent.slots.td_city.value : null;
    var dateSlotValue = intent.slots.Date ? intent.slots.Date.value : null;
    var sessionAttrs = {};
    if (citySlotValue) {
        sessionAttrs.date = body.session.attributes.date;
        TidePooler.handleCityDialogRequest(citySlotValue, sessionAttrs)
            .then(function (poolerCitySpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerCitySpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });
    } else if (dateSlotValue) {
        sessionAttrs.city = body.session.attributes.city.city;
        TidePooler.handleDateDialogRequest(dateSlotValue, sessionAttrs)
            .then(function (poolerDateSpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerDateSpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });
    } else {
        TidePooler.handleNoSlotDialogRequest(body.session.attributes)
            .then(function (poolerNoSlotSpeechResponse) {
                dialogTideSpeechResponse = poolerNoSlotSpeechResponse;
                deferred.resolve(dialogTideSpeechResponse);
            });
    }
    return deferred.promise;
}

function processPoolerSpeechResp(poolerDateSpeechResponse, body) {
    var processedResponse;
    var combinedAttributes = Object.assign(
        poolerDateSpeechResponse.sessionAttributes ? poolerDateSpeechResponse.sessionAttributes : {},
        body.session.attributes ? body.session.attributes : {}
    );
    if (poolerDateSpeechResponse.repromptOutput) {
        //ask for city or date
        processedResponse = AlexaSkillUtil.ask(
            poolerDateSpeechResponse.speechOutput,
            poolerDateSpeechResponse.repromptOutput,
            { "attributes": combinedAttributes });
    } else {
        //tell the final tide status
        processedResponse = AlexaSkillUtil.tellWithCard(
            poolerDateSpeechResponse.speechOutput,
            { "attributes": combinedAttributes },
            { "title": "TidePooler", "content": poolerDateSpeechResponse.speechOutput.text }
        );
    }
    return processedResponse;
}

//#region AGENT
function handleAgentFindIntent(body, deferred) {
    var findAgentSpeechResponse;
    var intent = body.request.intent;
    var zipValue = intent.slots.agent_zip ? intent.slots.agent_zip.value : undefined;
    var sessionAttrs = { "zip": zipValue, "agents": [] };

    aos.handleAgentFindRequest(sessionAttrs)
        .then(function (handleAgentFindResponse) {
            body.session.attributes.predictedIntent = zipValue ? "AGENTFINDEMAIL" : "AGENTFINDBYZIP";
            findAgentSpeechResponse = proessAlexaSpeechResp(handleAgentFindResponse, body, "Find Agent");
            deferred.resolve(findAgentSpeechResponse);
        });

    return deferred.promise;
}

function handleAgentFindByZipIntent(body, deferred) {
    var findAgentSpeechResponse;
    var intent = body.request.intent;
    var zipValue = intent.slots.agent_zip;
    var sessionAttrs = { "zip": zipValue };

    aos.handleAgentFindByZipIntent(sessionAttrs)
        .then(function (handleAgentFindResponse) {
            body.session.attributes.predictedIntent = "AGENTFINDEMAIL";
            findAgentSpeechResponse = proessAlexaSpeechResp(handleAgentFindResponse, body, "Find Agent");
            deferred.resolve(findAgentSpeechResponse);
        });

    return deferred.promise;
}

function handleAgentFindEmailYesIntent(body, deferred) {
    var findAgentSpeechResponse;
    var intent = body.request.intent;
    var emailSlot = intent.slots.email;
    var sessionAttrs = {
        "zip": body.session.attributes.zip,
        "agent": body.session.attributes.agent,
        "email": emailSlot.value
    };


    aos.handleAgentFindEmailYesIntent(sessionAttrs)
        .then(function (handleAgentFindResponse) {
            body.session.attributes.predictedIntent = sessionAttrs.email ? undefined : "GENERALSENDEMAIL";
            findAgentSpeechResponse = proessAlexaSpeechResp(handleAgentFindResponse, body, "Find Agent");
            deferred.resolve(findAgentSpeechResponse);
        });


    return deferred.promise;
}


function handleAgentFindByZipIntent(body, deferred) {
    var findAgentSpeechResponse;
    var intent = body.request.intent;
    var zipValue = intent.slots.agent_zip ? intent.slots.agent_zip.value : undefined;
    var sessionAttrs = { "zip": zipValue, "agents": [] };

    aos.handleAgentFindByZipIntent(sessionAttrs)
        .then(function (handleAgentFindResponse) {
            handleAgentFindResponse.sessionAttrs = sessionAttrs;
            body.session.attributes.predictedIntent = "AGENTFINDEMAIL";
            findAgentSpeechResponse = proessAlexaSpeechResp(handleAgentFindResponse, body, "Find Agent");
            deferred.resolve(findAgentSpeechResponse);
        });

    return deferred.promise;
}

function proessAlexaSpeechResp(handleAlexaResponse, body, titleText) {
    var processedResponse;
    var combinedAttributes = Object.assign(
        handleAlexaResponse.sessionAttrs ? handleAlexaResponse.sessionAttrs : {},
        body.session.attributes ? body.session.attributes : {}
    );
    if (handleAlexaResponse.repromptOutput) {
        //ask for zip
        processedResponse = AlexaSkillUtil.ask(
            handleAlexaResponse.speechOutput,
            handleAlexaResponse.repromptOutput,
            { "attributes": combinedAttributes });
    } else {
        //tell the final agent status
        processedResponse = AlexaSkillUtil.tellWithCard(
            handleAlexaResponse.speechOutput,
            { "attributes": combinedAttributes },
            { "title": titleText, "content": handleAlexaResponse.speechOutput.text }
        );
    }
    return processedResponse;

}
//#endregion
//#region RENTERS
function handlerAOSRentersInsuranceIntent(body, deferred) {
    var rentersInsuranceResponse;
    var intent = body.request.intent;
    var sessionAttrs = getAOSRentersSessionAttributes(body);
    aos.handleRentersInsuranceStart(sessionAttrs)
        .then(function (handleRentersInsuranceResp) {
            body.session.attributes.predictedIntent = "AOSRENTERSNAME";
            rentersInsuranceResponse = proessAlexaSpeechResp(handleRentersInsuranceResp, body, "Renters Insurance");
            deferred.resolve(rentersInsuranceResponse);
        });
    return deferred.promise;
}

function handlerAOSRentersInsuranceName(body, deferred) {
    var rentersInsuranceResponse;
    var intent = body.request.intent;
    var sessionAttrs = getAOSRentersSessionAttributes(body);
    aos.handleRentersInsuranceName(sessionAttrs)
        .then(function (handleRentersInsuranceResp) {
            body.session.attributes.predictedIntent = sessionAttrs.lastName ? "AOSRENTERSDOB" : "AOSRENTERSLASTNAME";
            rentersInsuranceResponse = proessAlexaSpeechResp(handleRentersInsuranceResp, body, "Renters Insurance");
            deferred.resolve(rentersInsuranceResponse);
        });
    return deferred.promise;
}

function handlerAOSRentersInsuranceDOB(body, deferred) {
    var rentersInsuranceResponse;
    var intent = body.request.intent;
    var sessionAttrs = getAOSRentersSessionAttributes(body);
    aos.handleRentersInsuranceDOB(sessionAttrs)
        .then(function (handleRentersInsuranceResp) {
            body.session.attributes.predictedIntent = "AOSRENTERSCURADDR";
            rentersInsuranceResponse = proessAlexaSpeechResp(handleRentersInsuranceResp, body, "Renters Insurance");
            deferred.resolve(rentersInsuranceResponse);
        });

    return deferred.promise;
}


function getAOSRentersSessionAttributes(body) {
    var sessionAttrs = {
        "firstName": undefined,
        "lastName": undefined,
        "dob": undefined,
        "addrLine1": undefined,
        "city": undefined,
        "zip": undefined,
        "IsInsuredAddrSame": undefined
    };
    var slots = body.request.intent.slots;
    if (slots) {
        sessionAttrs.firstName = slots.firstName ? slots.firstName.value : body.session.attributes.firstName;
        sessionAttrs.lastName = slots.lastName ? slots.lastName.value : body.session.attributes.lastName;
    }
    return sessionAttrs;
}

//#endregion
// private intents functions end

//private function end

module.exports = Allstate;


