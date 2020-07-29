# API Testing

This is a thing I wrote to figure out how to test a thing at work. It consists of three parts:

* `blob.json`, which mocks an API response for a GET request. It contains a number of:
  * `customer` entries, each of which contains an array of:
  * `storefronts`, each with an:
    * `storefrontName`, a string list of comma-separated
    * `locales`, as per ISO/IEC 15897 (`en_GB`, `sv_SE`, etc), and an
    * `APIendpoint` (yes, I know, inconsistent casing), and each `customer` entry also contains an array of
* `markets` (each market is a country code, similary to ISO 3166-1 alpha-2, or `ZZ` for "other")
* `main.py`, a very simple Python web server which serves the files and also returns a `login.json` endpoint response to a HTTP POST request.
  * The `login.json` POST response will return either an error (status 403, 404, or 500) or a success (status 200), based on random chance (this is because the various endpoints I want to query may return those errors) and, if it returns a 200 status, it will also return the following JSON `{"login": "success", "currency": "currency code", "endpoint": "the endpoint name", "locale": "the locale code", "market": "the market code"}`, where endpoint, locale, and market are read from the request body, which should containing the following JSON data:
    * `"endpoint": "endpoint name"`
    * `"locale": "locale code"`
    * `"market": "market code"`
* `script.js`, handles the `XMLHttpRequest`:ing of `blob.json`, parsing the list, getting a random locale and associated market, and should make an `XMLHttpRequest` POST request to the `login.json` endpoint for each storefront. If it's a success (status 200), it will parse the JSON it gets back and set the status of the associated `div` to `success`. If it's an error/failure, it should set the status of the associated `div` to `failure`.

## TODO

Make sure the `script.js` actually makes an `XMLHttpRequest` for each endpoint, and that it actually sets the status of right `div`s.
