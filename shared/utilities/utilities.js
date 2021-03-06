
var q = require('q');
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-eceeb1d9fe3c2821e4668ae4b9fbf475');

var Utilities = function () {

};
Utilities.prototype.GetRandomValue = function (inputArray) {
    var rand = inputArray[Math.floor(Math.random() * inputArray.length)];
    return rand;
};

Utilities.prototype.sendEmail = function (to, subject, body, type) {
    console.log("sendEmail - start");
    var deferred = q.defer();
    var data = {
        "from": "pavanneela10@gmail.com",
        "to": ["pavanneela10@gmail.com"],
        "subject": subject,
        "text": body
    };

    mg.sendText(data.from, data.to, data.subject, data.text, function (error) {
        deferred.resolve(error ? false : true)
    });


    return deferred.promise;
}

Utilities.prototype.getCombinedAddress = function (agentInfo) {
    var combinedAddr = "";
    if (agentInfo.addressLine1) {
        combinedAddr = combinedAddr + agentInfo.addressLine1 + ","
    }
    if (agentInfo.city) {
        combinedAddr = combinedAddr + agentInfo.city + ","
    }
    if (agentInfo.state) {
        combinedAddr = combinedAddr + agentInfo.state + " "
    }
    if (agentInfo.zipCode) {
        combinedAddr = combinedAddr + agentInfo.zipCode
    }

    return combinedAddr;
}



module.exports = new Utilities();