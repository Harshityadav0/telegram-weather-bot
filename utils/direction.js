export default function getDirection(degree) {
    let i, direction;
    i = Math.round(degree / 45);
    switch (i) {
        case 0:
            direction = "North";
            break;
        case 1:
            direction = "North-East";
            break;
        case 2:
            direction = "East";
            break;
        case 3:
            direction = "South-East";
            break;
        case 4:
            direction = "South";
            break;
        case 5:
            direction = "South-West";
            break;
        case 6:
            direction = "West";
            break;
        case 7:
            direction = "North-West";
            break;
        case 8:
            direction = "North";
            break;
    }
    return direction;
}