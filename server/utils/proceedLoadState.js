
const EN_ROUTE_TO_PICK_UP = 'En route to Pick Up';
const ARRIVED_TO_PICK_UP = 'Arrived to Pick Up';
const EN_ROUTE_TO_DELIVERY = 'En route to delivery';
const ARRIVED_TO_DELIVERY = 'Arrived to delivery';


module.exports = function (currentState) {
    switch (currentState){
        case EN_ROUTE_TO_PICK_UP:
            return ARRIVED_TO_PICK_UP;
        case ARRIVED_TO_PICK_UP:
            return EN_ROUTE_TO_DELIVERY;
        case EN_ROUTE_TO_DELIVERY:
            return ARRIVED_TO_DELIVERY;
        default:
            return currentState;
    }
}