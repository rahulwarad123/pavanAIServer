

var TidePooler = require('./../../../apps/tide-pooler/tide-pooler.js');
var aos = require('./../../../apps/aos/aos.js');
var ars = require('./../../../apps/ars/ars.js');
var q = require('q');

var ApiAiIntentHandler = function () { };

ApiAiIntentHandler.prototype.processResponse = function (body) {
    var deferred = q.defer();
    if (body.result && body.result.metadata && body.result.metadata.intentName) {
        intentHandlers(body)
            .then(function (responseInfo) {
                deferred.resolve(responseInfo);
            });
    }
    return deferred.promise;
}

function intentHandlers(body) {
    var deferred = q.defer();
    var intentName = body.result.metadata.intentName;
    var responseBody = {};
    switch (intentName.toUpperCase()) {
        case "WELCOME":
            handleWelcomeIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND":
            handleAgentFindIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-BYZIP":
            handleAgentFindByZip(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-BYCURRENTLOC":
            break;
        case "AGENT-FIND-EMAIL-YES":
            handleAgentFindEmailYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-EMAIL-NO":
            handleAgentFindEmailNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AGENT-FIND-EMAIL-SEND":
            handleAgentFindEmailSend(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "WEATHERFORECAST":
            var message = "Today in Boston: Fair, the temperature is 37 degree fahrenheit.";
            responseBody.speech = message;
            responseBody.displayText = message;
            deferred.resolve(responseBody);
            break;
        case "TDSUPPORTEDCITIES":
            var poolerSpeechResponse = TidePooler.getSupportedCitiesResponse();
            responseBody.speech = poolerSpeechResponse.speechOutput.text;
            responseBody.displayText = poolerSpeechResponse.speechOutput.text;
            deferred.resolve(responseBody);
            break;
        case "TDDIALOGTIDEINTENT":
            dialogTideIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "TDDIALOG-CITY":
            handleTDCityIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "TDDIALOG-DATE":
            handleTDDateIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "ARS-SERVICE-START":
        case "ARS-SERVICE-LOCATION":
            handleARSStartIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "ARS-SERVICE-VEHICLE-YEAR":
        case "ARS-SERVICE-VEHICLE-MAKE":
        case "ARS-SERVICE-VEHICLE-MODEL":
        case "ARS-SERVICE-VEHICLE-YMM":
            handleARSVehicleYMMIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "ARS-SERVICE-PRICE-AGREE":
            handleARSAgreementIntent(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-INSURANCE":
            handlerAOSRentersInsuranceStart(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-NAME":
        case "AOS-RENTERS-LASTNAME":
            handlerAOSRentersInsuranceName(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-DOB":
            handlerAOSRentersInsuranceDOB(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-CURADDR":
            handlerAOSRentersInsuranceAddr(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-CURADDR-LOC":
            handlerAOSRentersInsuranceAddrCurLoc(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-CURCITY-ZIP":
            handlerAOSRentersInsuranceCityZip(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RENTERS-INSADDRSAME-NO":
        case "AOS-RENTERS-INSADDRSAME-YES":
            handlerAOSRentersInsuranceInsuredAddrSame(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RETRIEVE-START":
            handlerAOSRetrieveInitiate(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RETRIEVE-LASTNAME":
            handlerAOSRetrieveLastName(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RETRIEVE-DOB":
            handlerAOSRetrieveDOB(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RETRIEVE-EMAIL":
            handlerAOSRetrieveEmail(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RETRIEVE-ZIP":
            handlerAOSRetrieveZipCode(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RETRIEVE-EMAIL-YES":
            handleRetrieveQuoteEmailYes(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RETRIEVE-EMAIL-NO":
            handleRetrieveQuoteEmailNo(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "AOS-RETRIEVE-EMAIL-SEND":
            handleRetrieveQuoteEmailSend(body, deferred)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;

        case "GET-LOCATION-PERMISSION":
            var permissionGranted = isPermissionGranted(body);
            handleGetLocationPermission(body, deferred, permissionGranted)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        case "HELPINTENT":
        default:
            var message = "You can say hello to me!";
            responseBody.speech = message;
            responseBody.displayText = message;
            deferred.resolve(responseBody);
            break;
    }
    return deferred.promise;
};

//#region permission
function isPermissionGranted(body) {
    var permissionStatus = body.originalRequest.data.inputs[0].arguments[0].text_value;
    if (permissionStatus === "true") {
        return true;
    } else {
        return false;
    }


}
function handleGetLocationPermission(body, deferred, pemissionGranted) {
    var agentFindSpeechResp = {};
    if (pemissionGranted) {
        var permissionSeekingIntent = getPermissionSeekingIntent(body);
        if (permissionSeekingIntent) {
            var intentName = permissionSeekingIntent.parameters.IntentName;
            var deviceZipCode = getDeviceZipcode(body);
            processPermissionSeekingIntent(body, deferred, deviceZipCode, intentName)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
        }
    } else {
        agentFindSpeechResp.speech = "Request aborted , still you can find agent in manual way";
        agentFindSpeechResp.displayText = "Request aborted , still you can find agent in manual way";
        deferred.resolve(agentFindSpeechResp);
    }
    return deferred.promise;
}

function processPermissionSeekingIntent(body, deferred, deviceZipCode, intentName) {
    switch (intentName.toUpperCase()) {
        case "AGENT-FIND-BYCURRENTLOC":
            processAgentFindByCurrentLoc(body, deferred, deviceZipCode)
                .then(function (responseInfo) {
                    deferred.resolve(responseInfo);
                });
            break;
        default:
            break;


    }
    return deferred.promise;
}

function getPermissionSeekingIntent(body) {
    var incomingContexts = body.result.contexts;
    var permissionSeekingIntent = incomingContexts.find(function (contextObj) {
        if (contextObj.name === "PermissionSeekingIntent") {
            return contextObj;
        }
    });
    return permissionSeekingIntent;
}


function getDeviceZipcode(body) {
    if (body.originalRequest.data.device) {
        return body.originalRequest.data.device.location.zip_code;
    }
}
//#endregion

//#region ARS

function handleARSAgreementIntent(body, deferred) {
    var arsSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "ars"; });
    var sessionAttrs = getARSSessionAttributes(agFindCntx);


    ars.handleRoadServiceAgreementHandler(sessionAttrs)
        .then(function (roasServiceResponse) {
            arsSpeechResp.speech = roasServiceResponse.speechOutput.text;
            arsSpeechResp.displayText = roasServiceResponse.speechOutput.text;
            deferred.resolve(arsSpeechResp);
        });

    return deferred.promise;
}

function handleARSStartIntent(body, deferred) {
    var arsSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "ars"; });
    var sessionAttrs = getARSSessionAttributes(agFindCntx);


    ars.handleRoadServiceHandler(sessionAttrs)
        .then(function (roasServiceResponse) {
            arsSpeechResp.speech = roasServiceResponse.speechOutput.text;
            arsSpeechResp.displayText = roasServiceResponse.speechOutput.text;
            deferred.resolve(arsSpeechResp);
        });

    return deferred.promise;
}

function handleARSVehicleYMMIntent(body, deferred) {
    var arsSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "ars"; });
    var sessionAttrs = getARSSessionAttributes(agFindCntx);


    ars.handleRoadServiceYMMHandler(sessionAttrs)
        .then(function (roasServiceResponse) {
            arsSpeechResp.speech = roasServiceResponse.speechOutput.text;
            arsSpeechResp.displayText = roasServiceResponse.speechOutput.text;
            deferred.resolve(arsSpeechResp);
        });

    return deferred.promise;
}

function getARSSessionAttributes(contextInfo) {
    var sessionAttrs = {
        "serviceType": undefined, "cost": undefined,
        "keyLocation": undefined, "vehicle": {}, "vehicleLocation": undefined
    };

    if (contextInfo) {
        var serviceType = contextInfo.parameters["ars-service-type.original"];
        if (serviceType && serviceType.trim().length > 0) {
            sessionAttrs.serviceType = contextInfo.parameters["ars-service-type"];
        }
        var keyLocation = contextInfo.parameters["ars-key-loc.original"];
        if (keyLocation && keyLocation.trim().length > 0) {
            sessionAttrs.keyLocation = contextInfo.parameters["ars-key-loc"];
        }
        var vehicleLocation = contextInfo.parameters["location.original"];
        if (vehicleLocation && vehicleLocation.trim().length > 0) {
            sessionAttrs.vehicleLocation = contextInfo.parameters["location"];
            if (sessionAttrs.vehicleLocation.toUpperCase() === 'CURRENT') {
                sessionAttrs.vehicleLocation = "1500 Capitol Drive, Northbrook, IL 60060";
            }
        }
        var vehicleYear = contextInfo.parameters["vehicle-year.original"];
        if (vehicleYear && vehicleYear.trim().length > 0) {
            sessionAttrs.vehicleYear = contextInfo.parameters["vehicle-year"];
        }
        var vehicleMake = contextInfo.parameters["vehicle-make.original"];
        if (vehicleMake && vehicleMake.trim().length > 0) {
            sessionAttrs.vehicleMake = contextInfo.parameters["vehicle-make"];
        }
        var vehicleModel = contextInfo.parameters["vehicle-model.original"];
        if (vehicleModel && vehicleModel.trim().length > 0) {
            sessionAttrs.vehicleModel = contextInfo.parameters["vehicle-model"];
        }
    }

    return sessionAttrs;
}


//#endregion

//#region Renters insurance
function handlerAOSRentersInsuranceStart(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceStart(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceName(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceName(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceDOB(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceDOB(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceAddr(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceAddr(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;

}

function handlerAOSRentersInsuranceCityZip(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceCityZip(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;

}

function handlerAOSRentersInsuranceInsuredAddrSame(body, deferred) {
    var rentersWelcomeSpeechResp = {};
    var result = body.result;
    var rentersCntx = result.contexts.find(function (curCntx) { return curCntx.name === "renters"; });
    var sessionAttrs = getAOSRentersSessionAttributes(rentersCntx);

    aos.handleRentersInsuranceInsuredAddrSame(sessionAttrs)
        .then(function (renterspeechResponse) {
            rentersWelcomeSpeechResp.speech = renterspeechResponse.speechOutput.text;
            rentersWelcomeSpeechResp.displayText = renterspeechResponse.speechOutput.text;
            deferred.resolve(rentersWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRentersInsuranceAddrCurLoc(body, deferred) {
    var rentersSpeechResp = {};
    rentersSpeechResp.speech = "To get your current location";
    rentersSpeechResp.displayText = "To get your current location";
    if (!rentersSpeechResp.contextOut) {
        rentersSpeechResp.contextOut = [];
    }
    rentersSpeechResp.contextOut.push({ "name": "PermissionSeekingIntent", "parameters": { "IntentName": "AOS-RENTERS-CURADDR-LOC" } });
    deferred.resolve(rentersSpeechResp);
    return deferred.promise;
}

function getAOSRentersSessionAttributes(contextInfo) {
    var sessionAttrs = {
        "firstName": undefined,
        "lastName": undefined,
        "dob": undefined,
        "addrLine1": undefined,
        "city": undefined,
        "zip": undefined,
        "IsInsuredAddrSame": undefined
    };

    if (contextInfo) {
        var firstName = contextInfo.parameters["given-name.original"];
        if (firstName && firstName.trim().length > 0) {
            sessionAttrs.firstName = contextInfo.parameters["given-name"];
        }
        var lastName = contextInfo.parameters["last-name.original"];
        if (lastName && lastName.trim().length > 0) {
            sessionAttrs.lastName = contextInfo.parameters["last-name"];
        }
        var dob = contextInfo.parameters["dob.original"];
        if (dob && dob.trim().length > 0) {
            sessionAttrs.dob = contextInfo.parameters["dob"];
        }
        var addrLine1 = contextInfo.parameters["address.original"];
        if (addrLine1 && addrLine1.trim().length > 0) {
            sessionAttrs.addrLine1 = contextInfo.parameters["address"];
        }
        var city = contextInfo.parameters["geo-city.original"];
        if (city && city.trim().length > 0) {
            sessionAttrs.city = contextInfo.parameters["geo-city"];
        }
        var zip = contextInfo.parameters["zip.original"];
        if (zip && zip.trim().length > 0) {
            sessionAttrs.zip = contextInfo.parameters["zip"];
            if (sessionAttrs.zip.length === 4) {
                sessionAttrs.zip = "0" + sessionAttrs.zip;
            }
        }
        sessionAttrs.IsInsuredAddrSame = contextInfo.parameters["IsInsuredAddrSame"] === "true" ? true : false;

    }

    return sessionAttrs;
}

//#endregion


//#region Agent

function handleWelcomeIntent(body, deferred) {
    var agentFindSpeechResp = {};
    agentFindSpeechResp.speech = "Welcome to Allstate. I can help find an agent, get you an insurance. I can even help you with Road Side Assistance.";
    agentFindSpeechResp.displayText = agentFindSpeechResp.speech;
    deferred.resolve(agentFindSpeechResp);
    return deferred.promise;
}

function handleAgentFindEmailYes(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agentfindbyzip"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);


    aos.handleAgentFindEmailYesIntent(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

function handleAgentFindEmailNo(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agentfindbyzip"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);


    aos.handleAgentFindEmailNoIntent(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;

}

function handleAgentFindEmailSend(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agentfindbyzip"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);

    console.log("handleAgentFindEmailSend - start");

    aos.handleAgentFindEmailSendIntent(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            console.log("handleAgentFindEmailSend - end");
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

function handleAgentFindByZip(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agent"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);

    if (sessionAttrs.zip) {
        aos.handleAgentFindByZipIntent(sessionAttrs)
            .then(function (agentFindSpeechResponse) {
                agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
                agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
                agentFindSpeechResp.contextOut = [{ "name": "AgentFindByZip", "parameters": sessionAttrs }];
                deferred.resolve(agentFindSpeechResp);
            });
    }
    return deferred.promise;
}

function handleAgentFindIntent(body, deferred) {
    var agentFindSpeechResp = {};
    var result = body.result;
    var agFindCntx = result.contexts.find(function (curCntx) { return curCntx.name === "agent"; });
    var sessionAttrs = getAgentSessionAttributes(agFindCntx);

    aos.handleAgentFindRequest(sessionAttrs)
        .then(function (agentFindSpeechResponse) {
            agentFindSpeechResp.speech = agentFindSpeechResponse.speechOutput.text;
            agentFindSpeechResp.displayText = agentFindSpeechResponse.speechOutput.text;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

function getAgentSessionAttributes(contextInfo) {
    var sessionAttrs = { "zip": undefined, "email": undefined, "agent": {} };
    if (contextInfo) {
        var zip = contextInfo.parameters["zip.original"];
        if (zip && zip.trim().length > 0) {
            sessionAttrs.zip = contextInfo.parameters["zip"];
        }
        var email = contextInfo.parameters["email.original"];
        if (email && email.trim().length > 0) {
            sessionAttrs.email = email;
        }
        if (contextInfo.parameters.agent) {
            sessionAttrs.agent = contextInfo.parameters.agent;
        }
    }

    return sessionAttrs;
}

//#endregion

//#region RetrieveQuote
function handlerAOSRetrieveInitiate(body, deferred) {
    var retrieveWelcomeSpeechResp = {};
    var result = body.result;
    var retrieveCntx = result.contexts.find(function (curCntx) { return curCntx.name === "aos-retv"; });
    var sessionAttrs = getRetrieveQuoteSessionAttributes(retrieveCntx);

    aos.handleRetrieveQuoteStart(sessionAttrs)
        .then(function (retrieveSpeechResponse) {
            retrieveWelcomeSpeechResp.speech = retrieveSpeechResponse.speechOutput.text;
            retrieveWelcomeSpeechResp.displayText = retrieveSpeechResponse.speechOutput.text;
            deferred.resolve(retrieveWelcomeSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRetrieveLastName(body, deferred) {
    var retrieveSpeechResp = {};
    var result = body.result;
    var retrieveCntx = result.contexts.find(function (curCntx) { return curCntx.name === "aos-retv"; });
    var sessionAttrs = getRetrieveQuoteSessionAttributes(retrieveCntx);

    aos.handleRetrieveQuoteLastName(sessionAttrs)
        .then(function (retrieveSpeechResponse) {
            retrieveSpeechResp.speech = retrieveSpeechResponse.speechOutput.text;
            retrieveSpeechResp.displayText = retrieveSpeechResponse.speechOutput.text;
            deferred.resolve(retrieveSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRetrieveDOB(body, deferred) {
    var retrieveSpeechResp = {};
    var result = body.result;
    var retrieveCntx = result.contexts.find(function (curCntx) { return curCntx.name === "aos-retv"; });
    var sessionAttrs = getRetrieveQuoteSessionAttributes(retrieveCntx);

    aos.handleRetrieveQuoteDOB(sessionAttrs)
        .then(function (retrievespeechResponse) {
            retrieveSpeechResp.speech = retrievespeechResponse.speechOutput.text;
            retrieveSpeechResp.displayText = retrievespeechResponse.speechOutput.text;
            deferred.resolve(retrieveSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRetrieveEmail(body, deferred) {
    var retrieveSpeechResp = {};
    var result = body.result;
    var retrieveCntx = result.contexts.find(function (curCntx) { return curCntx.name === "aos-retv"; });
    var sessionAttrs = getRetrieveQuoteSessionAttributes(retrieveCntx);

    aos.handleRetrieveQuoteEmail(sessionAttrs)
        .then(function (retrievespeechResponse) {
            retrieveSpeechResp.speech = retrievespeechResponse.speechOutput.text;
            retrieveSpeechResp.displayText = retrievespeechResponse.speechOutput.text;
            deferred.resolve(retrieveSpeechResp);
        });

    return deferred.promise;
}

function handlerAOSRetrieveZipCode(body, deferred) {
    var retrieveSpeechResp = {};
    var result = body.result;
    var retrieveCntx = result.contexts.find(function (curCntx) { return curCntx.name === "aos-retv"; });
    var sessionAttrs = getRetrieveQuoteSessionAttributes(retrieveCntx);

    aos.handleRetrieveQuoteZipCode(sessionAttrs)
        .then(function (retrievespeechResponse) {
            retrieveSpeechResp.speech = retrievespeechResponse.speechOutput.text;
            retrieveSpeechResp.displayText = retrievespeechResponse.speechOutput.text;
            deferred.resolve(retrieveSpeechResp);
        });

    return deferred.promise;
}

function handleRetrieveQuoteEmailYes(body, deferred) {
    var retrieveSpeechResp = {};
    var result = body.result;
    var retrieveCntx = result.contexts.find(function (curCntx) { return curCntx.name === "aos-retv"; });
    var sessionAttrs = getRetrieveQuoteSessionAttributes(retrieveCntx);


    aos.handleRetrieveQuoteEmailYesIntent(sessionAttrs)
        .then(function (retrieveQuoteSpeechResponse) {
            retrieveSpeechResp.speech = retrieveQuoteSpeechResponse.speechOutput.text;
            retrieveSpeechResp.displayText = retrieveQuoteSpeechResponse.speechOutput.text;
            deferred.resolve(retrieveSpeechResp);
        });

    return deferred.promise;
}

function handleRetrieveQuoteEmailNo(body, deferred) {
    var retrieveSpeechResp = {};
    var result = body.result;
    var retrieveCntx = result.contexts.find(function (curCntx) { return curCntx.name === "aos-retv"; });
    var sessionAttrs = getRetrieveQuoteSessionAttributes(retrieveCntx);


    aos.handleAgentFindEmailNoIntent(sessionAttrs)
        .then(function (retrieveQuoteSpeechResponse) {
            retrieveSpeechResp.speech = retrieveQuoteSpeechResponse.speechOutput.text;
            retrieveSpeechResp.displayText = retrieveQuoteSpeechResponsess.speechOutput.text;
            deferred.resolve(retrieveSpeechResp);
        });

    return deferred.promise;

}

function handleRetrieveQuoteEmailSend(body, deferred) {
    var retrieveSpeechResp = {};
    var result = body.result;
    var retrieveCntx = result.contexts.find(function (curCntx) { return curCntx.name === "aos-retv"; });
    var sessionAttrs = getRetrieveQuoteSessionAttributes(retrieveCntx);

    console.log("handleRetrieveQuoteEmailSend - start");

    aos.handleRetrieveQuoteEmailSendIntent(sessionAttrs)
        .then(function (retrieveQuoteSpeechResponse) {
            retrieveSpeechResp.speech = retrieveQuoteSpeechResponse.speechOutput.text;
            retrieveSpeechResp.displayText = retrieveQuoteSpeechResponse.speechOutput.text;
            console.log("handleRetrieveQuoteEmailSend - end");
            deferred.resolve(retrieveSpeechResp);
        });

    return deferred.promise;
}

function getRetrieveQuoteSessionAttributes(contextInfo) {
    var sessionQuoteAttrs = { "zipcode": undefined, "email": undefined, "lastname": undefined, "dob": undefined, "quotedetails": {} };
    if (contextInfo) {
        var zip = contextInfo.parameters["zipcode.original"];
        if (zip && zip.trim().length > 0) {
            sessionQuoteAttrs.zipcode = contextInfo.parameters["zipcode"];
        }
        var email = contextInfo.parameters["email.original"];
        if (email && email.trim().length > 0) {
            sessionQuoteAttrs.email = contextInfo.parameters["email"];
        }
        var lastname = contextInfo.parameters["lastname.original"];
        if (lastname && lastname.trim().length > 0) {
            sessionQuoteAttrs.lastname = contextInfo.parameters["lastname"];
        }
        var dob = contextInfo.parameters["dob.original"];
        if (dob && dob.trim().length > 0) {
            sessionQuoteAttrs.dob = contextInfo.parameters["dob"];
        }
        if (contextInfo.parameters.quotedetails) {
            sessionQuoteAttrs.quotedetails = contextInfo.parameters.quotedetails;
        }
    }

    return sessionQuoteAttrs;
}


//#endregion 

//#region Tidepooler
function handleTDCityIntent(body, deferred) {
    var dialogTideSpeechResponse = {};
    var result = body.result;
    var tdPoolerCntx = result.contexts.find(function (curCntx) { return curCntx.name === "tide-pooler"; });
    var sessionAttrs = getTDSessionAttributes(tdPoolerCntx);

    if (sessionAttrs.city) {
        TidePooler.handleCityDialogRequest(sessionAttrs.city, sessionAttrs)
            .then(function (poolerCitySpeechResponse) {
                dialogTideSpeechResponse.speech = poolerCitySpeechResponse.speechOutput.text;
                dialogTideSpeechResponse.displayText = poolerCitySpeechResponse.speechOutput.text;
                deferred.resolve(dialogTideSpeechResponse);
            });
    }

    return deferred.promise;
}
function handleTDDateIntent(body, deferred) {
    var dialogTideSpeechResponse = {};
    var result = body.result;
    var tdPoolerCntx = result.contexts.find(function (curCntx) { return curCntx.name === "tide-pooler"; });
    var sessionAttrs = getTDSessionAttributes(tdPoolerCntx);

    if (sessionAttrs.date) {
        TidePooler.handleDateDialogRequest(sessionAttrs.date, sessionAttrs)
            .then(function (poolerDateSpeechResponse) {
                dialogTideSpeechResponse.speech = poolerDateSpeechResponse.speechOutput.text;
                dialogTideSpeechResponse.displayText = poolerDateSpeechResponse.speechOutput.text;
                deferred.resolve(dialogTideSpeechResponse);
            });
    }


    return deferred.promise;
}

function getTDSessionAttributes(contextInfo) {
    var sessionAttrs = { "city": undefined, "date": undefined };

    if (contextInfo) {
        var cityOrg = contextInfo.parameters['geo-city.original'];
        var dateOrg = contextInfo.parameters['date.original'];
        if (cityOrg && cityOrg.length > 0) {
            sessionAttrs.city = contextInfo.parameters['geo-city'];
        }
        if (dateOrg && dateOrg.length > 0) {
            sessionAttrs.date = contextInfo.parameters.date;
        }
    }

    return sessionAttrs;
}


function dialogTideIntent(body, deferred) {
    var dialogTideSpeechResponse;
    var result = body.result;
    var city = result.parameters['geo-city'];
    var date = result.parameters.date;
    if (city) {
        TidePooler.handleCityDialogRequest(city, {})
            .then(function (poolerCitySpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerCitySpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });
    } else if (date) {
        TidePooler.handleDateDialogRequest(date, {})
            .then(function (poolerDateSpeechResponse) {
                dialogTideSpeechResponse = processPoolerSpeechResp(poolerDateSpeechResponse, body);
                deferred.resolve(dialogTideSpeechResponse);
            });

    } else {
        TidePooler.handleNoSlotDialogRequest(body)
            .then(function (noSlotSpeechResponse) {
                deferred.resolve(noSlotSpeechResponse);
            });
    }
    return deferred.promise;
}

function processPoolerSpeechResp(poolerDateSpeechResponse, body) {
    var responseInfo;


    return responseInfo;
}
//#endregion




module.exports = new ApiAiIntentHandler();


