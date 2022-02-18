const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const beautify = require('js-beautify').js;
const _ = require('lodash');
const GENERATE_API_DOC = true;

/**
 * @param {string} resource resource type
 */
function getDocCodeGetById(resource) {
    const responseExampleBody = require(`../docs/assets/FHIR/burni-create-examples-response/${resource}.json`);
    const responseXMLExampleBody = fs.readFileSync(path.join(__dirname, `../docs/assets/FHIR/burni-create-examples-response-xml/${resource}.xml`), { encoding: 'utf8'});
    const comment = `
    /**
     * 
     * @api {get} /fhir/${resource}/:id read ${resource}
     * @apiParam {string} id Resource ID in server
     * @apiName read${resource}
     * @apiGroup ${resource}
     * @apiVersion  v2.1.0
     * @apiDescription read ${resource} resource by id.
     * 
     * @apiExample {Shell} cURL
     * #example from: https://chinlinlee.github.io/Burni/assets/FHIR/fhir-resource-examples/${resource.toLowerCase()}-example.json
     * curl --location --request GET 'http://burni.example.com/fhir/${resource}/${responseExampleBody.id}'
     * @apiExample {JavaScript} javascript Axios
     //example from: https://chinlinlee.github.io/Burni/assets/FHIR/fhir-resource-examples/${resource.toLowerCase()}-example.json
    const axios = require('axios');
    const config = {
        method: 'get',
        url: 'http://burni.example.com/fhir/${resource}/${responseExampleBody.id}'
    };

    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
    * @apiSuccess (Success 200 Content-Type: application/fhir+json) {object} FHIR-JSON-RESOURCE
    * @apiSuccessExample {json} (200) name: Success-Response Content-Type: application/fhir+json
    ${JSON.stringify(responseExampleBody, null, 4)}
    * 
    * @apiSuccess (Success 200 Content-Type: application/fhir+xml) {object} FHIR-XML-RESOURCE
    * @apiSuccessExample {xml} (200) name: Success-Response-XML Content-Type: application/fhir+xml
    ${responseXMLExampleBody}
    *
    * @apiError (Error Not Found 404 Content-Type: application/fhir+json) {object} FHIR-JSON-RESOURCE
    * @apiErrorExample {json} (404) name: Not-Found-Response Content-Type: application/fhir+json
    {
        "resourceType": "OperationOutcome",
        "issue": [
            {
                "severity": "error",
                "code": "exception",
                "diagnostics": "not found ${resource}/${responseExampleBody.id}"
            }
        ]
    }
    *
    * @apiError (Error Not Found 404 Content-Type: application/fhir+xml) {object} FHIR-XML-RESOURCE
    * @apiErrorExample {xml} (404) name: Not-Found-Response-XML Content-Type: application/fhir+xml
    <OperationOutcome xmlns='http://hl7.org/fhir'>
    <issue>
        <severity value='error'/>
        <code value='exception'/>
        <diagnostics value='not found ${resource}/${responseExampleBody.id}'/>
    </issue>
    </OperationOutcome>
    *
    */
    `;
    return `${comment}`;
}

function getDocCodeCreate(resource) {
    const requestExampleBody = require(`../docs/assets/FHIR/fhir-resource-examples/${resource.toLowerCase()}-example.json`);
    const responseExampleBody = require(`../docs/assets/FHIR/burni-create-examples-response/${resource}.json`);
    const requestXMLExampleBody = fs.readFileSync(path.join(__dirname, `../docs/assets/FHIR/fhir-resource-examples-xml/${resource.toLowerCase()}-example.xml`), { encoding : 'utf8' });
    const responseXMLExampleBody = fs.readFileSync(path.join(__dirname,`../docs/assets/FHIR/burni-create-examples-response-xml/${resource}.xml`), { encoding: 'utf8'});
    const comment = `
    /**
     * 
     * @api {post} /fhir/${resource} create ${resource}
     * @apiName create${resource}
     * @apiGroup ${resource}
     * @apiVersion  v2.1.0
     * @apiDescription create ${resource} resource.
     * 
     * @apiParam {string=${resource}} resourceType 
     * @apiParamExample {json} name: json-example Content-Type: application/fhir+json
     * 
     ${JSON.stringify(requestExampleBody, null, 4)}
     *
     * @apiParamExample {xml} name: xml-example Content-Type: application/fhir+xml
     * 
     ${requestXMLExampleBody}
     *
     * @apiExample {Shell} cURL
     * #example from: https://chinlinlee.github.io/Burni/assets/FHIR/fhir-resource-examples/${resource.toLowerCase()}-example.json
     * curl --location --request POST 'http://burni.example.com/fhir/${resource} \\' 
     * --header 'Content-Type: application/fhir+json' \\
     * --data-raw '${JSON.stringify(responseExampleBody)}'
     * @apiExample {JavaScript} javascript Axios
     //example from: https://chinlinlee.github.io/Burni/assets/FHIR/fhir-resource-examples/${resource.toLowerCase()}-example.json
    const axios = require('axios');
    const data = ${JSON.stringify(responseExampleBody)}
    const config = {
        method: 'post',
        url: 'http://burni.example.com/fhir/${resource}',
        headers: { 
            'Content-Type': 'application/fhir+json'
        },
        data: data
    };

    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
    * @apiSuccess (Success 200 Content-Type: application/fhir+json) {object} FHIR-JSON-RESOURCE
    * @apiSuccessExample {json} (200) name: json-example Content-Type: application/fhir+json
    ${JSON.stringify(responseExampleBody, null, 4)}
    *
    * @apiSuccess (Success 200 Content-Type: application/fhir+xml) {object} FHIR-XML-RESOURCE 
    * @apiSuccessExample {xml} (200) name: xml-example Content-Type: application/fhir+xml
    ${responseXMLExampleBody}
    *
    * @apiError (Error Not Found 400 Content-Type: application/fhir+json) {object} FHIR-JSON-RESOURCE
    * @apiErrorExample {json} (400) name: Bad-Request-Response Content-Type: application/fhir+json
    {
        "resourceType": "OperationOutcome",
        "issue": [
            {
                "severity": "error",
                "code": "exception",
                "diagnostics": "validation error, path \`resourceType\` is required"
            }
        ]
    }
    * @apiError (Error Not Found 400 Content-Type: application/fhir+xml) {object} FHIR-XML-RESOURCE
    * @apiErrorExample {xml} (400) name: Bad-Request-Response Content-Type: application/fhir+xml
    * 
    <OperationOutcome xmlns='http://hl7.org/fhir'>
    <issue>
        <severity value='error'/>
        <code value='exception'/>
        <diagnostics value='validation error, path \`resourceType\` is required'/>
    </issue>
    </OperationOutcome>
    * 
    */
    `;
    return `${comment}`;
}

function getDocCodeUpdate(resource) {
    const requestExampleBody = require(`../docs/assets/FHIR/fhir-resource-examples-random-modify/${resource.toLowerCase()}-example.json`);
    const responseExampleBody = require(`../docs/assets/FHIR/burni-update-examples-response/${resource}.json`);
    const requestXMLExampleBody = fs.readFileSync(path.join(__dirname, `../docs/assets/FHIR/fhir-resource-examples-random-modify-xml/${resource.toLowerCase()}-example.xml`), { encoding: 'utf8'});
    const responseXMLExampleBody = fs.readFileSync(path.join(__dirname, `../docs/assets/FHIR/burni-update-examples-response-xml/${resource}.xml`), { encoding: 'utf8'});
    const comment = `
    /**
     * 
     * @api {put} /fhir/${resource}/:id update ${resource}
     * @apiName update${resource}
     * @apiGroup ${resource}
     * @apiVersion  v2.1.0
     * @apiDescription update ${resource} resource.
     * 
     * @apiParam {string=${resource}} resourceType 
     * @apiParamExample {json} name: json-example Content-Type: application/fhir+json
     * 
     ${JSON.stringify(requestExampleBody, null, 4)}
     *
     * @apiParamExample {xml} name: xml-example Content-Type: application/fhir+xml
     * 
     ${requestXMLExampleBody}
     *
     * @apiExample {Shell} cURL
     * #example from: https://chinlinlee.github.io/Burni/assets/FHIR/fhir-resource-examples/${resource.toLowerCase()}-example.json
     * curl --location --request PUT 'http://burni.example.com/fhir/${resource}/${resource}-example \\' 
     * --header 'Content-Type: application/fhir+json' \\
     * --data-raw '${JSON.stringify(requestExampleBody)}'
     * @apiExample {JavaScript} javascript Axios
     //example from: https://chinlinlee.github.io/Burni/assets/FHIR/fhir-resource-examples/${resource.toLowerCase()}-example.json
    const axios = require('axios');
    const data = ${JSON.stringify(responseExampleBody)}
    const config = {
        method: 'put',
        url: 'http://burni.example.com/fhir/${resource}/${resource}-example',
        headers: { 
            'Content-Type': 'application/fhir+json'
        },
        data: data
    };

    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
    * @apiSuccess (Success 200 Content-Type: application/fhir+json) {object} FHIR-JSON-RESOURCE
    * @apiSuccessExample {json} (200) name: json-example Content-Type: application/fhir+json
    ${JSON.stringify(responseExampleBody, null, 4)}
    *
    * @apiSuccess (Success 200 Content-Type: application/fhir+xml) {object} FHIR-XML-RESOURCE 
    * @apiSuccessExample {xml} (200) name: xml-example Content-Type: application/fhir+xml
    ${responseXMLExampleBody}
    *
    * @apiError (Error Not Found 400 Content-Type: application/fhir+json) {object} FHIR-JSON-RESOURCE
    * @apiErrorExample {json} (400) name: Bad-Request-Response Content-Type: application/fhir+json
    {
        "resourceType": "OperationOutcome",
        "issue": [
            {
                "severity": "error",
                "code": "exception",
                "diagnostics": "validation error, path \`resourceType\` is required"
            }
        ]
    }
    * @apiError (Error Not Found 400 Content-Type: application/fhir+xml) {object} FHIR-XML-RESOURCE
    * @apiErrorExample {xml} (400) name: Bad-Request-Response Content-Type: application/fhir+xml
    * 
    <OperationOutcome xmlns='http://hl7.org/fhir'>
    <issue>
        <severity value='error'/>
        <code value='exception'/>
        <diagnostics value='validation error, path \`resourceType\` is required'/>
    </issue>
    </OperationOutcome>
    * 
    */
    `;
    return `${comment}`;
}


/**
 * 
 * @param {Array} resources the resources want to use
 */
function generateDoc(resources) {
    for (let res in resources) {
        mkdirp.sync(`./docs/apidoc/apidoc-sources/${res}`);

        //#region getById
        const getById = getDocCodeGetById(res);
        fs.writeFileSync(`./docs/apidoc/apidoc-sources/${res}/get${res}ById.js`, beautify(getById));
        //#endregion

        //#region create
        const createCode = getDocCodeCreate(res);
        fs.writeFileSync(`./docs/apidoc/apidoc-sources/${res}/post${res}.js`, beautify(createCode));
        //#endregion

        //#region update (put)
        const updateCode = getDocCodeUpdate(res);
        fs.writeFileSync(`./docs/apidoc/apidoc-sources/${res}/put${res}.js`, beautify(updateCode));
        //#endregion
    }
}

//#region exec
const config = require('../config/config');
generateDoc(config);
//#endregion