import relationship from "../interfaces/relationship";

const relationships: relationship[] = [
    {
        $relationshipId: 'DigiZToFirstFloor',
        $sourceId: 'DigiZ',
        $relationshipName: 'hasFloors',
        $targetId: '1.Stock'
    },
    {
        $relationshipId: 'DigiZToErdgeschoss',
        $sourceId: 'DigiZ',
        $relationshipName: 'hasFloors',
        $targetId: 'Erdgeschoss'
    },
    {
        $relationshipId: 'FirstFloorToBesprechungsraum',
        $sourceId: '1.Stock',
        $relationshipName: 'hasRooms',
        $targetId: 'Besprechungsraum'
    },
    {
        $relationshipId: 'ErdgeschossToKueche',
        $sourceId: 'Erdgeschoss',
        $relationshipName: 'hasRooms',
        $targetId: 'Kueche'
    },
    {
        $relationshipId: 'ErdgeschossToAbstellraum',
        $sourceId: 'Erdgeschoss',
        $relationshipName: 'hasRooms',
        $targetId: 'Abstellraum'
    },
    {
        $relationshipId: 'ErdgeschossToGroßraum',
        $sourceId: 'Erdgeschoss',
        $relationshipName: 'hasRooms',
        $targetId: 'Grossraum'
    },
    {
        $relationshipId: 'GroßraumToDrucker1',
        $sourceId: 'Grossraum',
        $relationshipName: 'hasPrinters',
        $targetId: 'Drucker1'
    },
    {
        $relationshipId: 'GroßraumToDrucker2',
        $sourceId: 'Grossraum',
        $relationshipName: 'hasPrinters',
        $targetId: 'Drucker2'
    }
]  

export default relationships