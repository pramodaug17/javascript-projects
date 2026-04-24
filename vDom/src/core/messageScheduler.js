
export class MessageScheduler {
  constructor() {
    this.framInterval = 5; // ms per slice
    this.startTime = 0;
    this.callback = null;

    this.channel = new MessageChannel();

    this.channel.port1.onmessage = () => {
      if(this.callback) {
        this.startTime = performance.now();

        const shouldContinue = this.callback();

        if(shouldContinue) {
          this.schedule();  // continue nxt tick
        }
      }
    };
  }

  schedule(callback) {
    console.log("MessageChannel is used");
    this.callback = callback;
    this.channel.port2.postMessage(null);
  }

  shouldYield() {
    return (performance.now() - this.startTime) >= this.framInterval;
  }
}