export type PlantData = {
    id: number,
    name: string,
    nickname: string,
    description: string,
    image_path: string,
    days: number,
    watering_frequency: number,
    watering_amount: number
}
export let Plant: PlantData[] = [{
    "id":0,
    "name": "aloe vera",
    "nickname": "",
    "description": "A good plant",
    "image_path": "/aloe_vera.jpg",
    "days": -2,
    "watering_frequency": 5,
    "watering_amount": 50
},
{
    "id":1,
    "name": "monstera adansonii",
    "nickname": "Monstera",
    "description": "A sad plant",
    "image_path": "/monstera-adansonii.jpg",
    "days": -1,
    "watering_frequency": 3,
    "watering_amount": 40
},
{
    "id":2,
    "name": "chlorophytum comosum",
    "nickname": "Spider Plant",
    "description": "A scary plant",
    "image_path": "/spider_plant.jpg",
    "days": 0,
    "watering_frequency": 2,
    "watering_amount": 30
},
{
    "id":3,
    "name": "draecena trifasciata",
    "nickname": "Snake Plant",
    "description": "Ssssss plant",
    "image_path": "/snake_plant.png",
    "days": 2,
    "watering_frequency": 6,
    "watering_amount": 60
},]

export async function getPlantData () {
    return Plant;
}

export async function getPlantDetail(name: string) {
    return Plant.find(plant => plant.name === name)
}