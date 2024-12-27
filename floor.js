const floors = [9, 8, 7, 6, 5, 4, 3, 2, 1]; // Number of floors
const elevators = 5; // Number of elevators

const tableBody = document.getElementById("elevator-table");

floors.forEach(floor => {
    const row = document.createElement("tr");

    const floorLabel = document.createElement("td");
    floorLabel.className = "floor-name";
    floorLabel.dataset.floor = floor;
    floorLabel.textContent = getOrdinalSuffix(floor);
    row.appendChild(floorLabel);

    for (let elevator = 0; elevator < elevators; elevator++) {
        const elevatorCell = document.createElement("td");
        elevatorCell.className = "elevator-cell";
        elevatorCell.dataset.elevator = elevator;
        elevatorCell.dataset.floor = floor;
        row.appendChild(elevatorCell);
    }

    const actionCell = document.createElement("td");
    actionCell.className = "floor-action";
    const callButton = document.createElement("button");
    callButton.className = "call-button";
    callButton.dataset.floor = floor;
    callButton.textContent = "Call";
    actionCell.appendChild(callButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
});

function getOrdinalSuffix(floor) {
    const lastDigit = floor % 10;
    const lastTwoDigits = floor % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return `${floor}th`;
    }

    switch (lastDigit) {
        case 1:
            return `${floor}st`;
        case 2:
            return `${floor}nd`;
        case 3:
            return `${floor}rd`;
        default:
            return `${floor}th`;
    }
}