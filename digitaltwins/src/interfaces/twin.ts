export default interface twin {
    Id: string,
    modelId: string,
    properties: keyValuePair[]
}

interface keyValuePair {
    key: string,
    value: any
}