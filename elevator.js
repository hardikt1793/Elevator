document.addEventListener('DOMContentLoaded', function () {
    const NUM_ELEVATORS = 5;
    const callQueue = [];
    const elevatorState = Array.from({ length: NUM_ELEVATORS }, () => ({ floor: 0, busy: false }));

    function findNearestElevator(floor) {
        let nearestElevator = null;
        let minDistance = Infinity;

        elevatorState.forEach((elevator, index) => {
            if (!elevator.busy) {
                const distance = Math.abs(elevator.floor - floor);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestElevator = index;
                }
            }
        });

        return nearestElevator;
    }

    function runElevator(elevatorIndex, floor) {
        const elevator = document.querySelector(`.elevator-svg[data-elevator="${elevatorIndex}"]`);
        const currentFloor = elevatorState[elevatorIndex].floor;
        const floorsToMove = Math.abs(currentFloor - floor);
        const timeToReach = floorsToMove * 1000;
        elevatorState[elevatorIndex].busy = true;
        elevatorState[elevatorIndex].floor = floor;

        const newCell = document.querySelector(`.elevator-cell[data-elevator="${elevatorIndex}"][data-floor="${floor}"]`);
        const transformValue = newCell.offsetTop - elevator.parentElement.offsetTop;

        if (timeToReach) {
            const arrivalMessage = floor === 0 ? newCell.querySelector('.arrival-message') : newCell;
            arrivalMessage.textContent = `Arriving in ${timeToReach / 1000} sec`;
        }

        elevator.style.stroke = 'red';
        elevator.style.transition = `transform ${timeToReach / 1000}s linear`;
        elevator.style.transform = `translateY(${transformValue}px)`;

        setTimeout(() => {
            ringBell();
            setTimeout(() => {
                if (timeToReach) {
                    const arrivalMessage = floor === 0 ? newCell.querySelector('.arrival-message') : newCell;
                    arrivalMessage.textContent = '';
                }
                elevator.style.stroke = 'green';
                const callButton = document.querySelector(`.call-button[data-floor="${floor}"]`);
                callButton.textContent = 'Arrived';
                callButton.classList.add('arrived');
                setTimeout(() => {
                    elevator.style.stroke = '';
                    callButton.textContent = 'Call';
                    callButton.classList.remove('arrived', 'waiting');
                    callButton.disabled = false;
                    elevatorState[elevatorIndex].busy = false;
                    manageQueue();
                }, 2000);
            }, 0);
        }, timeToReach);
    }

    function ringBell() {
        const audio = new Audio('ring.mp3');
        audio.play();
    }

    function manageQueue() {
        if (callQueue.length > 0) {
            const nextCall = callQueue.shift();
            const elevatorIndex = findNearestElevator(nextCall.floor);

            if (elevatorIndex !== null) {
                runElevator(elevatorIndex, nextCall.floor);
            } else {
                callQueue.unshift(nextCall);
            }
        }
    }

    document.querySelectorAll('.call-button').forEach(button => {
        button.addEventListener('click', function () {
            const floor = parseInt(this.getAttribute('data-floor'));
            if (!this.classList.contains('waiting')) {
                this.textContent = 'Waiting';
                this.classList.add('waiting');
                this.disabled = true;

                callQueue.push({ floor: floor });
                manageQueue();
            }
        });
    });
});
