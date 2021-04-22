"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = [
    {
        "@id": "dtmi:com:digiz:venue;1",
        "@type": "Interface",
        "@context": "dtmi:dtdl:context;2",
        "displayName": "Venue",
        "contents": [
            {
                "@type": "Relationship",
                "name": "hasFloors",
                "target": "dtmi:com:digiz:floor;1",
            },
            {
                "@type": "Property",
                "name": "venueName",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "city",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "postcode",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "street",
                "schema": "string"
            }
        ]
    },
    {
        "@id": "dtmi:com:digiz:floor;1",
        "@type": "Interface",
        "@context": "dtmi:dtdl:context;2",
        "displayName": "Floor",
        "contents": [
            {
                "@type": "Relationship",
                "name": "hasRooms"
            },
            {
                "@type": "Property",
                "name": "floorName",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "storey",
                "schema": "string"
            }
        ]
    },
    {
        "@id": "dtmi:com:digiz:room;1",
        "@type": "Interface",
        "@context": "dtmi:dtdl:context;2",
        "displayName": "Room",
        "contents": [
            {
                "@type": "Relationship",
                "name": "hasPrinters"
            },
            {
                "@type": "Property",
                "name": "roomName",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "temperature",
                "schema": "double"
            },
            {
                "@type": "Property",
                "name": "humidity",
                "schema": "double"
            },
            {
                "@type": "Property",
                "name": "occupancy",
                "schema": "boolean"
            },
            {
                "@type": "Property",
                "name": "unitNameMaps",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "co2ThresholdYellow",
                "schema": "double"
            },
            {
                "@type": "Property",
                "name": "co2ThresholdRed",
                "schema": "double"
            },
            {
                "@type": "Property",
                "name": "co2",
                "schema": "double"
            },
            {
                "@type": "Property",
                "name": "loudness",
                "schema": "double"
            },
            {
                "@type": "Property",
                "name": "voc",
                "schema": "double"
            },
            {
                "@type": "Property",
                "name": "light",
                "schema": "double"
            }
        ]
    },
    {
        "@id": "dtmi:com:digiz:printer;1",
        "@type": "Interface",
        "@context": "dtmi:dtdl:context;2",
        "displayName": "3D-Drucker",
        "contents": [
            {
                "@type": "Property",
                "name": "name",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "Description",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "brand",
                "schema": "string"
            },
            {
                "@type": "Property",
                "name": "ambientTemperature",
                "schema": "double"
            }
        ]
    }
];
exports.default = models;
