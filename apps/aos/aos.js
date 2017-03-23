var SpeechResponse = require('./../../shared/data-models/speechResponse.js');
var Speech = require('./../../shared/data-models/speech');
var Utilities = require('./../../shared/utilities/utilities.js');
var DateUtil = require('./../../shared/utilities/dateUtil.js');
var agents = require('./../../shared/data-models/agent.js');
var Session = require('./../../shared/data-models/session.js');
var Agent = require('./../../shared/data-models/agent.js');
var Address = require('./../../shared/data-models/address.js');
var RetrieveQuote = require('./../../shared/data-models/retrieveQuote.js');

var q = require('q');
var request = require('request');

var AOS = function () { };

var AOSTranData = [];

//#region CONSTANTS
var URL_COMMON = "https://purchase.allstate.com/onlinesalesapp-common/";
var URL_RENTERS_SESSIONID = URL_COMMON + "api/transaction/RENTERS/sessionid";
var URL_AUTO_SESSIONID = URL_COMMON + "api/transaction/AUTO/sessionid";
var URL_GETAGENTS = URL_COMMON + "api/common/agents";
var URL_GETSTATE = URL_COMMON + "api/location/{0}/state";
var URL_RENTERS_BASE = "https://purchase.allstate.com/onlinesalesapp-renters/api";
var URL_RENTERS_SAVECUSTOMER = URL_RENTERS_BASE + "/renters/customer";
var URL_RETRIEVEQUOTE = URL_COMMON + "api/quote-repository";

var FROM_EMAIL_ID = "npavangouda@gmail.com";
var AGENTFINDRESP = [
    "Sure. what's your zip code?",
    "I can help you with that. What's your zip?",
    "Please provide the zip?",
];
var EMAILRESP = [
    "Sure. what's your email id?",
    "Please provide the email id",
    "Email id please",
    "What's the email id?",
    "please provide email id"
];
var EMAILSENTRESPAGENT = [
    "Email sent.",
    "We have sent an email to you.",
    "We have sent an email to you with agent details.",
    "Agent details has been sent to your mailbox.",
];
//#endregion

//#region PUBLIC METHODS

//#region PUBLIC AGENT
AOS.prototype.handleAgentFindRequest = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.zip) {
        getFinalAgentFindResponse(sessionAttrs)
            .then(function (agentSpeechOutput) {
                agentFindSpeechResp.speechOutput = agentSpeechOutput;
                agentFindSpeechResp.repromptOutput = null;
                agentFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(agentFindSpeechResp);
            });
    } else {
        speechOutput.text = Utilities.GetRandomValue(AGENTFINDRESP);
        repromptOutput.text = Utilities.GetRandomValue(AGENTFINDRESP);
        agentFindSpeechResp.speechOutput = speechOutput;
        agentFindSpeechResp.repromptOutput = repromptOutput;
        deferred.resolve(agentFindSpeechResp);
    }

    return deferred.promise;
};

AOS.prototype.handleAgentFindByZipIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();


    getFinalAgentFindResponse(sessionAttrs)
        .then(function (agentSpeechOutput) {
            agentFindSpeechResp.speechOutput = agentSpeechOutput;
            agentFindSpeechResp.repromptOutput = agentSpeechOutput;
            agentFindSpeechResp.sessionAttrs = sessionAttrs;
            deferred.resolve(agentFindSpeechResp);
        });

    return deferred.promise;
}

AOS.prototype.handleAgentFindEmailYesIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.email) {
        getFinalAgentFindSendEmailResponse(sessionAttrs)
            .then(function (agentSpeechOutput) {
                agentFindSpeechResp.speechOutput = agentSpeechOutput;
                agentFindSpeechResp.repromptOutput = null;
                deferred.resolve(agentFindSpeechResp);
            });
    } else {
        speechOutput.text = Utilities.GetRandomValue(EMAILRESP);
        repromptOutput.text = Utilities.GetRandomValue(EMAILRESP);
        agentFindSpeechResp.speechOutput = speechOutput;
        agentFindSpeechResp.repromptOutput = repromptOutput;
        deferred.resolve(agentFindSpeechResp);
    }


    return deferred.promise;
};

AOS.prototype.handleAgentFindEmailNoIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();

    speechOutput.text = "Thank you for chosing Allstate. You are in Good Hands.";
    agentFindSpeechResp.speechOutput = speechOutput;
    agentFindSpeechResp.repromptOutput = null;
    deferred.resolve(agentFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleAgentFindEmailSendIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var agentFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    getFinalAgentFindSendEmailResponse(sessionAttrs)
        .then(function (agentSpeechOutput) {
            agentFindSpeechResp.speechOutput = agentSpeechOutput;
            agentFindSpeechResp.repromptOutput = null;
            deferred.resolve(agentFindSpeechResp);
        });


    return deferred.promise;

};
//#endregion

//#region PUBLIC RENTERS
AOS.prototype.handleRentersInsuranceStart = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Let's get you a Renters quote. I would need your first and last name.";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
}

AOS.prototype.handleRentersInsuranceName = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.lastName) {
        speechOutput.text = "Please provide your date of birth.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    } else {
        speechOutput.text = sessionAttrs.firstName + ", please provide last name.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }
    deferred.resolve(rentersFindSpeechResp);



    return deferred.promise;
}

AOS.prototype.handleRentersInsuranceDOB = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Please provide your current address, or say current location";
    rentersFindSpeechResp.speechOutput = speechOutput;
    rentersFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleRentersInsuranceAddr = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    rentersFindSpeechResp.contextOut = [];
    if (sessionAttrs.addrLine1) {
        speechOutput.text = "Please provide your city and zip";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    } else {
        speechOutput.text = "To get your current location";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
        rentersFindSpeechResp.contextOut.push({ "name": "PermissionSeekingIntent", "parameters": { "IntentName": "AOS-RENTERS-CURADDR" } });
    }
    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleRentersInsuranceCityZip = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
    if (sessionAttrs.zip && sessionAttrs.city) {
        speechOutput.text = sessionAttrs.firstName + ", is the address you would like to insure same as current address?";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    } else if (sessionAttrs.zip && !sessionAttrs.city) {
        speechOutput.text = sessionAttrs.firstName + ", please provide city.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    } else if (!sessionAttrs.zip && sessionAttrs.city) {
        speechOutput.text = sessionAttrs.firstName + ", please provide zip.";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }

    deferred.resolve(rentersFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleRentersInsuranceInsuredAddrSame = function (sessionAttrs) {
    var deferred = q.defer();
    var rentersFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.IsInsuredAddrSame) {
        getRentersSaveCustomerResponse(sessionAttrs)
            .then(function (saveCustSpeechOutput) {
                rentersFindSpeechResp.speechOutput = saveCustSpeechOutput;
                rentersFindSpeechResp.repromptOutput = null;
                rentersFindSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(rentersFindSpeechResp);
            });
    } else {
        speechOutput.text = "Ok, What is the address you would like to insure?";
        rentersFindSpeechResp.speechOutput = speechOutput;
        rentersFindSpeechResp.repromptOutput = speechOutput;
    }

    return deferred.promise;
};
//#endregion

//#region PUBLIC RETRIEVEQUOTE
AOS.prototype.handleRetrieveQuoteStart = function (sessionAttrs) {
    var deferred = q.defer();
    var retrieveFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Let's retrieve your quote. I would need your last name.";
    retrieveFindSpeechResp.speechOutput = speechOutput;
    retrieveFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(retrieveFindSpeechResp);

    return deferred.promise;
}

AOS.prototype.handleRetrieveQuoteLastName = function (sessionAttrs){
    var deferred = q.defer();
    var retrieveSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
   
    speechOutput.text = "Please provide your date of birth.";
    retrieveSpeechResp.speechOutput = speechOutput;
    retrieveSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(retrieveSpeechResp);

    return deferred.promise;
}

AOS.prototype.handleRetrieveQuoteDOB = function (sessionAttrs) {
    var deferred = q.defer();
    var retrieveFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Please provide your email address";
    retrieveFindSpeechResp.speechOutput = speechOutput;
    retrieveFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(retrieveFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleRetrieveQuoteEmail = function (sessionAttrs) {
    var deferred = q.defer();
    var retrieveFindSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    speechOutput.text = "Please provide your zip code, or say current location";
    retrieveFindSpeechResp.speechOutput = speechOutput;
    retrieveFindSpeechResp.repromptOutput = speechOutput;
    deferred.resolve(retrieveFindSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleRetrieveQuoteZipCode = function (sessionAttrs) {
    var deferred = q.defer();
    var savedQuoteSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();
     if (sessionAttrs.zipcode && sessionAttrs.email && sessionAttrs.dob && sessionAttrs.lastname) {
         getSavedQuoteResponse(sessionAttrs)
            .then(function (savedQuoteSpeechOutput) {
                savedQuoteSpeechResp.speechOutput = savedQuoteSpeechOutput;
                savedQuoteSpeechResp.repromptOutput = null;
                savedQuoteSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(savedQuoteSpeechResp);
            });

    }
    else{
                savedQuoteSpeechResp.speechOutput = "Something went wrong while retrieving please try later.";
                savedQuoteSpeechResp.repromptOutput = null;
                savedQuoteSpeechResp.sessionAttrs = sessionAttrs;
                deferred.resolve(savedQuoteSpeechResp);
    }
    return deferred.promise;
};

AOS.prototype.handleRetrieveQuoteEmailYesIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var retrieveQuoteSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    if (sessionAttrs.email) {
        getFinalRetrieveQuoteSendEmailResponse(sessionAttrs)
            .then(function (retrieveQuoteSpeechOutput) {
                retrieveQuoteSpeechResp.speechOutput = retrieveQuoteSpeechOutput;
                retrieveQuoteSpeechResp.repromptOutput = null;
                deferred.resolve(retrieveQuoteSpeechResp);
            });
    } else {
        speechOutput.text = Utilities.GetRandomValue(EMAILRESP);
        repromptOutput.text = Utilities.GetRandomValue(EMAILRESP);
        retrieveQuoteSpeechResp.speechOutput = speechOutput;
        retrieveQuoteSpeechResp.repromptOutput = repromptOutput;
        deferred.resolve(retrieveQuoteSpeechResp);
    }


    return deferred.promise;
};

AOS.prototype.handleRetrieveQuoteEmailNoIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var retrieveQuoteSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();

    speechOutput.text = "Thank you for chosing Allstate. You are in Good Hands.";
    retrieveQuoteSpeechResp.speechOutput = speechOutput;
    retrieveQuoteSpeechResp.repromptOutput = null;
    deferred.resolve(retrieveQuoteSpeechResp);

    return deferred.promise;
};

AOS.prototype.handleRetrieveQuoteEmailSendIntent = function (sessionAttrs) {
    var deferred = q.defer();
    var retrieveQuoteSpeechResp = new SpeechResponse();
    var speechOutput = new Speech();
    var repromptOutput = new Speech();

    getFinalRetrieveQuoteSendEmailResponse(sessionAttrs)
        .then(function (retrieveQuoteSpeechOutput) {
            retrieveQuoteSpeechResp.speechOutput = retrieveQuoteSpeechOutput;
            retrieveQuoteSpeechResp.repromptOutput = null;
            deferred.resolve(retrieveQuoteSpeechResp);
        });


    return deferred.promise;

};
//#endregion

//#endregion

//#region PRIVATE METHODS

//#region PRIVATE AGENT
function getFinalAgentFindSendEmailResponse(sessionAttrs) {
    var deferred = q.defer();
    var finalSpeechOutput = new Speech();
    var to = sessionAttrs.email;
    var subject = "Allstate agent details: " + sessionAttrs.agent.name;
    var body = buildAgentEmailBody(sessionAttrs.agent, to);
    Utilities.sendEmail(to, subject, body)
        .then(function (emailStatus) {
            if (emailStatus) {
                finalSpeechOutput.text = Utilities.GetRandomValue(EMAILSENTRESPAGENT) + "Thank you, for choosing Allstate.";
            } else {
                finalSpeechOutput.text = "Sorry! there was a problem while sending the email to you. Please try again later.";
            }
            deferred.resolve(finalSpeechOutput);
        })


    return deferred.promise;
}

function buildAgentEmailBody(agentInfo, to) {
    var emailBody = "";

    emailBody = emailBody + "\nThank you for your interest in Allstate agents.\n"
    emailBody = emailBody + "\nBelow are details you requested regarding our agent: " + agentInfo.name;
    emailBody = emailBody + "\n-------------------------------------------------------";
    emailBody = emailBody + "\nAdderess: " + Utilities.getCombinedAddress(agentInfo);
    emailBody = emailBody + "\nPhone: " + agentInfo.phoneNumber;
    emailBody = emailBody + "\nEmail: " + agentInfo.emailAddress;

    return emailBody;
}

function getFinalAgentFindResponse(sessionAttrs) {
    var deferred = q.defer();
    var finalSpeechOutput = new Speech();
    var sessionInfo = new Session();
    sessionInfo.zip = sessionAttrs.zip;

    startAOSSession()
        .then(function (id) {
            sessionInfo.sessionId = id;
            return getStateFromZip(sessionInfo.sessionId, sessionInfo.zip);
        }).then(function (state) {
            sessionInfo.state = state;
            return getAgents(sessionInfo);
        }).then(function (agentsResp) {
            if (agentsResp && agentsResp.length > 0) {
                sessionAttrs.agent = agentsResp[0];
                var firstAgentName = agentsResp[0].name;
                finalSpeechOutput.text = "nearest Allstate agent to you is, " + firstAgentName +
                    ". You can call the agent at " + agentsResp[0].phoneNumber +
                    ". Or, would you like me to email you the agent details?";
            } else {
                finalSpeechOutput.text = "sorry! no agents are available at zip " + sessionInfo.zip;
            }
            deferred.resolve(finalSpeechOutput);
        }).catch(function (error) {
            finalSpeechOutput.text = "something went wrong with agent service. Please try again later.";
            deferred.resolve(finalSpeechOutput);
        });

    return deferred.promise;
};

function ProcessAgentResponse(agentServResp) {
    var agents = [];
    if (agentServResp && agentServResp.agentAvailable && agentServResp.agents.length > 0) {
        for (var index = 0; index < agentServResp.agents.length; index++) {
            var currServAgent = agentServResp.agents[index];
            var agentInfo = new Agent();
            agentInfo.id = currServAgent.id;
            agentInfo.name = currServAgent.name;
            agentInfo.addressLine1 = currServAgent.addressLine1;
            agentInfo.city = currServAgent.city;
            agentInfo.state = currServAgent.state;
            agentInfo.zipCode = currServAgent.zipCode;
            agentInfo.phoneNumber = currServAgent.phoneNumber;
            agentInfo.imageUrl = currServAgent.imageURL;
            agentInfo.emailAddress = currServAgent.emailAddress;
            agents.push(agentInfo);
        }
    }

    return agents;
}
//#endregion

//#region PRIVATE RENTERS
function getRentersSaveCustomerResponse(sessionAttrs) {
    var deferred = q.defer();
    var saveCustSpeechOutput = new Speech();
    var sessionInfo = new Session();
    sessionInfo.zip = sessionAttrs.zip;

    startAOSSession()
        .then(function (id) {
            sessionInfo.sessionId = id;
            return getStateFromZip(sessionInfo.sessionId, sessionInfo.zip);
        }).then(function (state) {
            sessionInfo.state = state;
            var customerSaveInfo = getCustomerSaveInfo(sessionAttrs, sessionInfo);
            return rentersSaveCustomer(customerSaveInfo, sessionInfo.sessionId);
        }).then(function (saveResp) {
            if (saveResp && saveResp.transactionToken) {
                saveCustSpeechOutput.text = "Your control number is: " + saveResp.transactionToken.controlNumber.split("").join(" ");
            }
            deferred.resolve(saveCustSpeechOutput);
        }).catch(function (error) {
            saveCustSpeechOutput.text = "something went wrong with renters insurance service. Please try again later.";
            deferred.resolve(saveCustSpeechOutput);
        });

    return deferred.promise;
}

function getCustomerSaveInfo(sessionAttrs, sessionInfo) {
    var customerData = {};
    customerData.firstName = sessionAttrs.firstName;
    customerData.lastName = sessionAttrs.lastName;
    customerData.dateOfBirth = DateUtil.getFormattedDate(sessionAttrs.dob, "MMDDYYYY");
    customerData.mailingAddress = sessionAttrs.addrLine1;
    customerData.city = sessionAttrs.city;
    customerData.state = sessionInfo.state;
    customerData.zipCode = sessionAttrs.zip;
    customerData.aWSFlag = "N";
    customerData.affinity = {};
    customerData.insuredAddress = new Address();//{ "addressLine1": "", "aptOrUnit": "", "city": "", "state": "", "zipCode": "" };
    customerData.isInsuredAddressSameAsCurrent = sessionAttrs.IsInsuredAddrSame;
    return customerData;
}

//#endregion

//#region PRIVATE RETRIEVEQUOTE
function getSavedQuoteResponse(sessionAttrs) {
    var deferred = q.defer();
    var finalSpeechOutput = new Speech();
    var sessionInfo = new Session();
    sessionInfo.zipcode = sessionAttrs.zipcode;
    sessionInfo.dob = sessionAttrs.dob;
    sessionInfo.email = sessionAttrs.email;
    sessionInfo.lastname = sessionAttrs.lastname;
    startAutoAOSSession()
        .then(function (id) {
            sessionInfo.sessionId = id;
            return getStateFromZip(sessionInfo.sessionId, sessionInfo.zipcode);
        }).then(function (state) {
            sessionInfo.state = state;
            return getSavedQuote(sessionInfo);
        }).then(function (quoteResp) {
            if (quoteResp && quoteResp.length > 0) {
                sessionAttrs.quotedetails = quoteResp;
                var quoteDetails = quoteResp;
                finalSpeechOutput.text = retrieveSpeachOutText(quoteResp);
            } else {
                finalSpeechOutput.text = "sorry! no saved policies are available with these inputs.Would you like to insure for renters?";
            }
            deferred.resolve(finalSpeechOutput);
        }).catch(function (error) {
            finalSpeechOutput.text = "something went wrong with retrieve quote service. Please try again later.";
            deferred.resolve(finalSpeechOutput);
        })

    return deferred.promise;
};

function retrieveSpeachOutText(quotes) {
    var textOut = null;
    if(quotes) {
        if(quotes.length == 1) {        
            if(quotes[0].policyNumber){
                textOut = "You have a " + quotes[0].product + " policy with policy number," + quotes[0].policyNumber
                    +" and the policy was purchased on," + quotes[0].startDate;
            }             
    }
    else if(quotes.length > 1) {
        textOut = "Great!! you have multiple policies with,";
            for (var index = 0; index < quotes.length; index++) {
                if(quotes[index].policyNumber){
                    textOut  = textOut +  quotes[index].product + ", policy with the policy number," + quotes[index].policyNumber + " ,and the policy was purchased on," +quotes[index].startDate;                                
                }                        
            }
        }
        textOut = textOut + ", would you like me to email you the quote details?";
    }
    else{
        textOut = "I see that you do not have any purchased policies with these inputs.";
    }
    return textOut;
};

function getFinalRetrieveQuoteSendEmailResponse(sessionAttrs) {
    var deferred = q.defer();
    var finalSpeechOutput = new Speech();
    var to = sessionAttrs.email;
    var subject = "Allstate policy details " ;
    var body = buildRetrieveQuoteEmailBody(sessionAttrs.quotedetails, to);
    Utilities.sendEmail(to, subject, body)
        .then(function (emailStatus) {
            if (emailStatus) {
                finalSpeechOutput.text = "We have sent an email with all the details. Thank you, for choosing Allstate.";
            } else {
                finalSpeechOutput.text = "Sorry! there was a problem while sending the email to you. Please try again later.";
            }
            deferred.resolve(finalSpeechOutput);
        })


    return deferred.promise;
}

function buildRetrieveQuoteEmailBody(policiesInfo, to) {
    var emailBody = "";
 
    emailBody = emailBody + "\nThank you for your purchasing Allstate insurance.\n"
    if(policiesInfo){
        for (var index = 0; index < policiesInfo.length; index++) {
                emailBody = emailBody + "\nBelow are details you requested regarding: " + policiesInfo[index].policyNumber;
                emailBody = emailBody + "\n-------------------------------------------------------";
                emailBody = emailBody + "\Product: " + policiesInfo[index].product;
                emailBody = emailBody + "\nPurchased On: " + policiesInfo[index].startDate;
                emailBody = emailBody + "\nAssociated Agent Name: " + policiesInfo[index].agentName;
                emailBody = emailBody + "\nAssociated Agent Phone number: " + policiesInfo[index].agentPhoneNumber;                       
                emailBody = emailBody + "\nAssociated Agent Email address: " + policiesInfo[index].agentEmailAddress;
                emailBody = emailBody + "\n-------------------------------------------------------";
                emailBody = emailBody + "\n-------------------------------------------------------";                                              
            }
        
    }  

    return emailBody;
}
//#endregion
//#endregion

//#region AOS API CALLS
function startAOSSession(zip) {
    var deferred = q.defer();
    request({ method: 'GET', uri: URL_RENTERS_SESSIONID }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            errormsg = "Error from server session";
            deferred.reject(errormsg);
        } else {
            var sessionId = response.headers['x-tid'];
            deferred.resolve(sessionId);
        }
    });
    return deferred.promise;
}

function startAutoAOSSession(zip) {
    var deferred = q.defer();
    request({ method: 'GET', uri: URL_AUTO_SESSIONID }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            errormsg = "Error from server session";
            deferred.reject(errormsg);
        } else {
            var sessionId = response.headers['x-tid'];
            deferred.resolve(sessionId);
        }
    });
    return deferred.promise;
}

function getStateFromZip(sessionId, zip) {
    var deferred = q.defer();
    var urlGetStateFromZip = URL_GETSTATE.replace("{0}", zip);
    request({ method: 'GET', uri: urlGetStateFromZip, headers: { "X-TID": sessionId } },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = JSON.parse(response.body);
                deferred.resolve(responseJson.stateCode);
            }
        });
    return deferred.promise;
}

function rentersSaveCustomer(customerSaveInfo, sessionId) {
    var deferred = q.defer();
    request(
        {
            method: "POST",
            uri: URL_RENTERS_SAVECUSTOMER,
            json: customerSaveInfo,
            headers: { "X-TID": sessionId, "x-pd": "RENTERS" }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var responseJson = response.body;
                deferred.resolve(responseJson);
            }
        });

    return deferred.promise;
}

function getSavedQuote(sessionInfo) {
    var deferred = q.defer();
    if(sessionInfo.dob){
        var dob = DateUtil.getFormattedDate(sessionInfo.dob, "MMDDYYYY");
        sessionInfo.dob = dob;
    }
    request(
        {
            method: 'POST',
            uri: URL_RETRIEVEQUOTE,
            "content-type": "application/json",
            headers: { "X-pd": "AUTO", "X-TID": sessionInfo.sessionId },
            json: true,
            body: { "lastName": sessionInfo.lastname,"dateOfBirth": sessionInfo.dob,"emailID": sessionInfo.email,"zipCode": sessionInfo.zipcode }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var quotes = ProcessQuoteResponse(response.body);
                deferred.resolve(quotes);
            }
        });

    return deferred.promise;
}

function getAgents(sessionInfo) {
    var deferred = q.defer();
    request(
        {
            method: 'POST',
            url: URL_GETAGENTS,
            "content-type": "application/json",
            headers: {
                "X-TID": sessionInfo.sessionId,
                "X-ST": sessionInfo.state
            },
            json: true,
            body: { "zipCode": sessionInfo.zip }
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                errormsg = "Error from server session";
                deferred.reject(errormsg);
            } else {
                var agents = ProcessAgentResponse(response.body);
                deferred.resolve(agents);
            }
        });

    return deferred.promise;
}
//#endregion

//#region RESPONSE MAPPERS
function ProcessQuoteResponse(retrieveQuoteServResp) {
    var quotes = [];
    if (retrieveQuoteServResp && retrieveQuoteServResp.quoteList && retrieveQuoteServResp.quoteList.length > 0) {
        for (var index = 0; index < retrieveQuoteServResp.quoteList.length; index++) {
            var currSavedQuote = retrieveQuoteServResp.quoteList[index];
            var savedQuote = new RetrieveQuote();
            if(currSavedQuote.policyNumber){
            savedQuote.policyNumber = currSavedQuote.policyNumber;
            savedQuote.controlNumber = currSavedQuote.controlNumber;
            savedQuote.product = currSavedQuote.product;
            savedQuote.startDate = currSavedQuote.startDate;
            if(currSavedQuote && currSavedQuote.agentBusinessCard)
                {
                    savedQuote.agentName = currSavedQuote.agentBusinessCard.name;  
                    savedQuote.agentPhoneNumber = currSavedQuote.agentBusinessCard.phoneNumber;  
                    savedQuote.agentEmailAddress = currSavedQuote.agentBusinessCard.emailAddress;            
                }       
            }
                
            quotes.push(savedQuote);
        }
    }

    return quotes;
}

//#endregion

module.exports = new AOS();