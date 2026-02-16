let io;

export const initSocket = (serverIO) => {
  io = serverIO;
};

export const emitTelemetry = (data) => {
  if (io) {
    io.emit("telemetry", data);
  }
};
