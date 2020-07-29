(function() {
"use strict";

const button = document.getElementById("button");
const log = document.getElementById("log");
const storefrontArea = document.getElementById("allstorefronts");

var getCustomers = new XMLHttpRequest();
var getEndpoint = new XMLHttpRequest();
var response = new Object();

button.addEventListener("click", clicky);

function clicky() {
    log.innerHTML = 'Click.<br>';
    storefrontArea.innerHTML = '';
    getCustomers.addEventListener("progress", listUpdateProgress);
    getCustomers.addEventListener("loadend", listTransferComplete);
    getCustomers.open("GET", "http://localhost:8080/blob.json");
    getCustomers.send();
};

function listUpdateProgress() {
    log.innerHTML = log.innerHTML + "Loading...<br>"
}

function listTransferComplete() {
    status = getCustomers.status;
    switch(status) {
        case '200':
            log.innerHTML = log.innerHTML + 'Done.<br>';
            response = JSON.parse(getCustomers.responseText);
            parseCustomers(response);
            break;
        case '404':
            log.innerHTML = log.innerHTML + 'Oh no, file not found.<br>';
            break;
        case '500':
            log.innerHTML = log.innerHTML + 'Oh no, transfer failed.<br>';
            break;
        default:
            console.log('💩');
    };
};

function parseCustomers(response) {
    log.innerHTML = log.innerHTML + "Parsing.<br><hr>"
    for (let i = 0; i < response.length; i++) {
        var customer = response[i];
        var customerName = document.createElement("div");
        var customerNameText = document.createTextNode('Customer: ' + customer.customer);
        customerName.setAttribute("id", "customer");
        customerName.appendChild(customerNameText);
        storefrontArea.appendChild(customerName);
        var markets = customer.markets;
        var storefronts = customer.storefronts;
        for (let j = 0; j < storefronts.length; j++) {
            var storefront = storefronts[j];
            var storefrontName = document.createElement("div");
            var storefrontNameText = document.createTextNode('Storefront: ' + storefront.storefrontName);
            storefrontName.setAttribute("id", "storefront" + i + j);
            storefrontName.appendChild(storefrontNameText);
            customerName.appendChild(storefrontName);
            var endpoints = storefront.endpoints;
            for (let k = 0; k < endpoints.length; k++) {
                var endpoint = endpoints[k];
                var endpointName = document.createElement("div");
                var endpointNameText = document.createTextNode('Endpoint: ' + endpoint.APIEndpoint);
                endpointName.setAttribute("id", "endpoint" + i + j + k);
                endpointName.appendChild(endpointNameText);
                storefrontName.appendChild(endpointName);
                var apiEndpoint = endpoint.APIEndpoint;
                var localeList = endpoint.locales.split(',');
                var locale = localeList[Math.floor(Math.random() * Math.floor(localeList.length))];
                if (markets.includes(locale.slice(-2))) {
                    var market = locale.slice(-2);
                } else {
                    var market = "ZZ";
                }
                var localeMarket = document.createElement("div")
                var localeMarketText = document.createTextNode('Locale: ' + locale + ', Market: ' + market);
                localeMarket.setAttribute("id", "localeMarket");
                localeMarket.appendChild(localeMarketText);
                endpointName.appendChild(localeMarket);
                console.log("Testing endpoint: " + apiEndpoint);
                function testEndpoint(i,j,k,endpoint,locale,market) {
                    var data = new Object;
                    data = {"endpoint": endpoint, "locale": locale, "market": market};
                    var dataString = JSON.stringify(data);
                    var apiEndpointName = "endpoint" + i + j + k;
                    getEndpoint.addEventListener("loadend", endpointTransferComplete);
                    getEndpoint.open("POST", "http://localhost:8080/login.json", true);
                    console.log("Trying to send " + dataString);
                    getEndpoint.setRequestHeader("Content-type", "application/json");
                    getEndpoint.send(dataString);
                    var endpointId = document.getElementById(apiEndpointName);
                    function endpointTransferComplete() {
                        status = getEndpoint.status;
                        console.log(apiEndpointName + ": " + status);
                        switch(status) {
                            case '200':
                                response = JSON.parse(getEndpoint.responseText);
                                // parseEndpointJSON(response);
                                endpointId.setAttribute("class", "success");
                                break;
                            case '404':
                                endpointId.setAttribute("class", "failure");
                                break;
                            case '500':
                                endpointId.setAttribute("class", "failure");
                                break;
                            default:
                                endpointId.setAttribute("class", "failure");
                                console.log('💩');
                        };
                        apiEndpointName = '';        
                        /* function parseEndpointJSON(response) {
                            var link = new String();
                        }; */
                    };
                };
                testEndpoint(i,j,k,apiEndpoint,locale,market);
            };
        };
    };
};

})();