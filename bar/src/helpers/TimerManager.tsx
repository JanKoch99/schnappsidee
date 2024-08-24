class TimerManager {
    private timerElements: NodeListOf<HTMLDivElement>;
    private intervalId: number | null = null;

    constructor(private checkForExpiredTimer: () => void,
                private updateInterval: number = 60000) { // Default to 60 seconds
        this.timerElements = document.querySelectorAll('.timer');
        this.startTimer();
    }

    private startTimer() {
        this.updateTimerDisplay();
        // Update the display every minute
        this.intervalId = window.setInterval(() => {
            this.updateTimerDisplay();
        }, this.updateInterval);
    }

    private updateTimerDisplay() {
        this.timerElements.forEach((element) => {
            const dataUpdatedAt = element.dataset.updatedAt;
            if (dataUpdatedAt) {
                const updatedAt = new Date(dataUpdatedAt);
                const minutesLeft = this.calculateMinutesLeft(updatedAt);
                if (minutesLeft <= 0) {
                    element.textContent = "0'";
                } else {
                    element.textContent = `${Math.floor(minutesLeft)}'`;
                }
            }
        });
    }

    private calculateMinutesLeft(updatedAt: Date): number {
        const now = new Date();
        const elapsed = (now.getTime() - updatedAt.getTime()) / 1000; // Convert to seconds
        const elapsedMinutes = elapsed / 60; // Convert to minutes
        const minLeft = Math.max(0, 60 - elapsedMinutes); // 60 minutes minus elapsed time
        if (minLeft <= 0) {
            this.checkForExpiredTimer();
        }
        return minLeft;
    }

    public stopTimer() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
    }
}

export default  TimerManager;
