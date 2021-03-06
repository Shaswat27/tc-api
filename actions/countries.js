/*
 * Copyright (C) 2013 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0
 * @author mekanizumu
 */
"use strict";

/**
 * This is the function that actually get the countries.
 * 
 * @param {Object} api The api object that is used to access the global infrastructure
 * @param {Object} connection The connection object for the current request
 * @param {Object} dbConnectionMap The database connection map for the current request
 * @param {Function} next The callback to be called after this function is done
 */
var getCountries = function (api, connection, dbConnectionMap, next) {
    api.dataAccess.executeQuery("get_countries", {}, dbConnectionMap, function (err, result) {
        api.log("Execute result returned", "debug");
        if (err) {
            api.helper.handleError(err);
            next(connection, true);
        } else {
            api.log("Forward result", "debug");
            var ret = [], i, t;
            for (i = 0; i < result.length; i = i + 1) {
                t = {};
                t.countryCode = result[i].country_code;
                t.countryName = result[i].country_name;
                t.modifyDate = result[i].modify_date;
                t.participating = result[i].participating;
                t.default_taxform_id = result[i].default_taxform_id;
                t.longitude = result[i].longitude;
                t.latitude = result[i].latitude;
                t.region = result[i].region;
                ret.push(t);
            }
            connection.response = ret;
            next(connection, true);
        }

    });
};

/**
 * The API for getting countries
 */
exports.countries = {
    name : "countries",
    description : "countries",
    inputs : {
        required : [],
        optional : []
    },
    blockedConnectionTypes : [],
    outputExample : {},
    version : 'v2',
    transaction : 'read', // this action is read-only
    databases : ['common_oltp'],
    run : function (api, connection, next) {
        if (connection.dbConnectionMap) {
            api.log("Execute countries#run", 'debug');
            getCountries(api, connection, connection.dbConnectionMap, next);
        } else {
            api.log("dbConnectionMap is null", "debug");
            connection.rawConnection.responseHttpCode = 500;
            connection.response = {message: "No connection object."};
            next(connection, true);
        }
    }
};

/**
 * The API for getting countries, while this is guarded by OAuth
 */
exports.countriesSecured = {
    name : 'countriesSecured',
    description : 'countriesSecured',
    inputs : {
        required : [],
        optional : []
    },
    permissionScope : 'COUNTRY_REST',
    outputExample : {},
    version : 'v2',
    transaction : 'read', // this action is read-only
    databases : ['common_oltp'],
    run : function (api, connection, next) {
        if (connection.dbConnectionMap) {
            api.log("Execute countriesSecured#run", 'debug');
            getCountries(api, connection, connection.dbConnectionMap, next);
        } else {
            api.log("dbConnectionMap is null", "debug");
            connection.rawConnection.responseHttpCode = 500;
            connection.response = {message: "No connection object."};
            next(connection, true);
        }
    }
};
