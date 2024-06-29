export class Cron {
    constructor(second, minute) {
        this.second = second;
        this.minute = minute;
    }

    start() {
        this.timerInterval = setInterval(() => {this.timer();}, 1000)
    }

    stop() {
        clearInterval(this.timerInterval);
    }

    reset() {
        this.second = 0;
        this.minute = 0;
    }

    timer() {
        if ((this.second += 1) == 60) {
            this.second = 0
            this.minute += 1;
        }

        document.querySelector("#cron-text").innerText = 
            "Tempo: " + ("00" + this.minute).slice(-2) + 
            ":" + ("00" + this.second).slice(-2);
    }
}
