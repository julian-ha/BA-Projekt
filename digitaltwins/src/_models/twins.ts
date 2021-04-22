import twin from "../interfaces/twin";

var twins: twin[] = [
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
    },
    {
        Id: 'Küche',
        modelId: 'dtmi:com:digiz:room;1',
        properties: [
            {
                key: 'roomName',
                value: 'Küche'
            },
            {
                key: 'temperature',
                value: 0
            },
            {
                key: 'humidity',
                value: 0
            },
            {
                key: 'occupancy',
                value: false
            },
            {
                key: 'co2ThresholdYellow',
                value: 0
            },
            {
                key: 'co2ThresholdRed',
                value: 0
            },
            {
                key: 'co2ThresholdRed',
                value: 0
            },
            {
                key: 'loudness',
                value: 0
            },
            {
                key: 'voc',
                value: 0
            },
            {
                key: 'light',
                value: 0
            },
            {
                key: 'co2',
                value: 0
            }
        ]
    },
    {
        Id: 'Abstellraum',
        modelId: 'dtmi:com:digiz:room;1',
        properties: [
            {
                key: 'roomName',
                value: 'Abstellraum'
            },
            {
                key: 'temperature',
                value: 0
            },
            {
                key: 'humidity',
                value: 0
            },
            {
                key: 'occupancy',
                value: false
            },
            {
                key: 'co2ThresholdYellow',
                value: 0
            },
            {
                key: 'co2ThresholdRed',
                value: 0
            },
            {
                key: 'co2ThresholdRed',
                value: 0
            },
            {
                key: 'loudness',
                value: 0
            },
            {
                key: 'voc',
                value: 0
            },
            {
                key: 'light',
                value: 0
            },
            {
                key: 'co2',
                value: 0
            }
        ]
    },
    {
        Id: 'Großraum',
        modelId: 'dtmi:com:digiz:room;1',
        properties: [
            {
                key: 'roomName',
                value: 'Großraum'
            },
            {
                key: 'temperature',
                value: 0
            },
            {
                key: 'humidity',
                value: 0
            },
            {
                key: 'occupancy',
                value: false
            },
            {
                key: 'co2ThresholdYellow',
                value: 0
            },
            {
                key: 'co2ThresholdRed',
                value: 0
            },
            {
                key: 'co2ThresholdRed',
                value: 0
            },
            {
                key: 'loudness',
                value: 0
            },
            {
                key: 'voc',
                value: 0
            },
            {
                key: 'light',
                value: 0
            },
            {
                key: 'co2',
                value: 0
            }
        ]
    },
    {
        Id: 'Besprechungsraum',
        modelId: 'dtmi:com:digiz:room;1',
        properties: [
            {
                key: 'roomName',
                value: 'Besprechungsraum'
            },
            {
                key: 'temperature',
                value: 0
            },
            {
                key: 'humidity',
                value: 0
            },
            {
                key: 'occupancy',
                value: false
            },
            {
                key: 'co2ThresholdYellow',
                value: 0
            },
            {
                key: 'co2ThresholdRed',
                value: 0
            },
            {
                key: 'co2ThresholdRed',
                value: 0
            },
            {
                key: 'loudness',
                value: 0
            },
            {
                key: 'voc',
                value: 0
            },
            {
                key: 'light',
                value: 0
            },
            {
                key: 'co2',
                value: 0
            }
        ]
    },
    {
        Id: 'Drucker1',
        modelId: 'dtmi:com:digiz:printer;1',
        properties: [
            {
                key: 'name',
                value: '3D-Drucker 1'
            },
            {
                key: 'Description',
                value: 'Das ist die beschreibung zu Drucker 1'
            },
            {
                key: 'brand',
                value: 'ASDF'
            },
            {
                key: 'ambientTemperature',
                value: 0
            },
            
        ]
    },    
    {
        Id: 'Drucker2',
        modelId: 'dtmi:com:digiz:printer;1',
        properties: [
            {
                key: 'name',
                value: '3D-Drucker 2'
            },
            {
                key: 'Description',
                value: 'Das ist die beschreibung zu Drucker 2'
            },
            {
                key: 'brand',
                value: 'ASDF'
            },
            {
                key: 'ambientTemperature',
                value: 0
            },
            
        ]
    },  
    
]


export default twins