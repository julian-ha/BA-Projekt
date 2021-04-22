export default interface model {
    "@id": string,
    "@type": string,
    "@context": string,
    displayName: string,
    contents: contents[]
    

}

interface contents {
    "@type": string,
    name: string,
    schema?: string
    target?: string,
}