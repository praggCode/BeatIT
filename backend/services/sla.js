const EventEmitter = require("eventemitter3");
const emitter = new EventEmitter();

const DEFAULT_THRESHOLDS = {
  p99: 1000,
  errorRate: 5, 
  throughput: 10,
};

function checkSLA(metrics, thresholds = DEFAULT_THRESHOLDS) {
  if (metrics.p99 > thresholds.p99) {
    emitter.emit('breach', {
      metric: 'p99',
      value: metrics.p99,
      threshold: thresholds.p99,
      severity: 'high'
    });
  }
  if (parseFloat(metrics.errorRate) > thresholds.errorRate) {
    emitter.emit("breach", {
      metric: "errorRate",
      value: metrics.errorRate,
      threshold: thresholds.errorRate,
      severity: "critical",
    });
  }

  if (metrics.throughput < thresholds.throughput) {
    emitter.emit("breach", {
      metric: "throughput",
      value: metrics.throughput,
      threshold: thresholds.throughput,
      severity: "medium",
    });
  }
}


module.exports = { emitter, checkSLA };