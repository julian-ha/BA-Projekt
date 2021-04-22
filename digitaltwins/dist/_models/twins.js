"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var twins = [
    {
        Id: 'DigiZ',
        modelId: 'dtmi:com:digiz:venue;1',
        properties: [
            {
                key: 'venueName',
                value: 'Digitalisierungszentrum Heidenheim'
            },
            {
                key: 'city',
                value: 'Heidenheim an der Brenz'
            },
            {
                key: 'postcode',
                value: '89520'
            },
            {
                key: 'street',
                value: 'Leibniz-Campus 7'
            },
        ]
    },
    {
        Id: 'Erdgeschoss',
        modelId: 'dtmi:com:digiz:floor;1',
        properties: [
            {
                key: 'floorName',
                value: 'Erdgeschoss'
            },
            {
                key: 'storey',
                value: '0'
            }
        ]
    },
    {
        Id: '1.Stock',
        modelId: 'dtmi:com:digiz:floor;1',
        properties: [
            {
                key: 'floorName',
                value: '1. Stock'
            },
            {
                key: 'storey',
                value: '1'
            }
        ]
    }
];
exports.default = twins;
