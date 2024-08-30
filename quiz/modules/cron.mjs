class Cron {
    constructor(second, minute, hour) {
        this.second = second;
        this.minute = minute;
        this.hour = hour;
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
        this.hour = 0;
    }

    timer() {
        if ((this.second += 1) == 60) {
            this.second = 0
            this.minute += 1;
        }
        if (this.minute == 60) {
            this.minute = 0
            this.hour += 1;
        }

        document.querySelector("#cron-text").innerText = 
            ("00" + this.hour).slice(-2) + ":" +
           ("00" + this.minute).slice(-2) + 
            ":" + ("00" + this.second).slice(-2);
    }
}
