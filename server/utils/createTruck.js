
const SPRINTER = 'SPRINTER';
const SMALL_STRAIGHT = 'SMALL STRAIGHT';
const LARGE_STRAIGHT = 'LARGE STRAIGHT'

const createTruck = (length, width, height, payload) => (
    {
        dimensions: {
            width,
            length,
            height
        },
        payload
    }
)


module.exports = function (type) {
    switch (type) {
        case SPRINTER:
            return createTruck(300,250,170,1700);
        case SMALL_STRAIGHT:
            return createTruck(500,250,170,2500)
        case LARGE_STRAIGHT:
            return createTruck(700,350,200,4000)
        default:
            return null
    }
}