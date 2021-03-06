
export interface TwinData {

        "$dtId": string,
        "$etag": string
        "roomName": string,
        "unitNameMaps": string,
        "temperature": number,
        "humidity": number,
        "occupancy": boolean,
        "co2ThresholdYellow": number,
        "co2ThresholdRed": number,
        "loudness": number,
        "voc": number,
        "light": number,
        "co2": number,
        "connectionState": boolean,
        "printers"?: printerData[],
        "$metadata": {
            "$model": string,
            "roomName": {
                "lastUpdateTime": Date
            },
            "unitNameMaps": {
                "lastUpdateTime": Date
            },
            "temperature": {
                "lastUpdateTime": Date
            },
            "humidity": {
                "lastUpdateTime": Date
            },
            "occupancy": {
                "lastUpdateTime": Date
            },
            "co2ThresholdYellow": {
                "lastUpdateTime": Date
            },
            "co2ThresholdRed": {
                "lastUpdateTime": Date
            },
            "loudness": {
                "lastUpdateTime": Date
            },
            "voc": {
                "lastUpdateTime": Date
            },
            "light": {
                "lastUpdateTime": Date
            },
            "co2": {
                "lastUpdateTime": Date
            },
            "connectionState": {
                "lastUpdateTime": Date
            }
        }
}

export interface printerData {
    
        "$dtId": string,
        "$etag":string,
        "name": string,
        "Description": string,
        "brand": string,
        "ambientTemperature": number
        "connectionState": boolean,
        "$metadata": {
          "$model": string,
          "name": {
            "lastUpdateTime": Date
          },
          "Description": {
            "lastUpdateTime": Date
          },
          "brand": {
            "lastUpdateTime": Date
          },
          "ambientTemperature": {
            "lastUpdateTime": Date
          },
          "connectionState": {
            "lastUpdateTime": Date
          }
        }
      
}
