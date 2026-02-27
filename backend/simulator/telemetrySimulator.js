import Telemetry from "../models/telemetryModel.js";
import Dozer from "../models/Dozer.js";
import { emitTelemetry } from "../services/socketService.js";

const random = (min, max) =>
  Number((Math.random() * (max - min) + min).toFixed(1));

export const startTelemetrySimulator = async () => {
  try {
    const dozers = await Dozer.find();

    if (!dozers.length) {
      console.log("❌ No dozers found");
      return;
    }

    console.log("🚜 Starting simulator for", dozers.length, "dozers");

   dozers.forEach((dozer, index) => {

  const intervals = [30000, 5000, 10000, 10000]; // 3min, 5s, 1min, 10s

  const intervalTime = intervals[index % intervals.length];
      // random between 1500ms – 3500ms

      setInterval(async () => {
        try {

          const data = {
            dozerId: dozer._id,

            engineOilPressure: random(0.5, 8.5),
            transmissionOilPressure: random(0, 35),
            transmissionOilTemp: random(40, 140),
            waterTemp: random(40, 120),
            waterLevel: random(10, 100),
            batteryStatus: random(11.5, 13),
            batteryCharging: Math.random() > 0.5,
            engineOn: true,
          };

          const saved = await Telemetry.create(data);

          emitTelemetry({
            ...saved._doc,
            vehicleNumber: dozer.vehicleNumber
          });

          console.log(
            `📡 ${dozer.vehicleNumber} updated (interval: ${intervalTime}ms)`
          );

        } catch (err) {
          console.error("Simulator error:", err);
        }

      }, intervalTime);

    });

  } catch (err) {
    console.error("Simulator start error:", err);
  }
};