interface PlaneAngleEvent {
  eventName: 'PLANE_ANGLE';
  data: {
    angle: number;
  };
}

interface PlaneSpeedEvent {
  eventName: 'PLANE_SPEED';
  data: {
    speed: number;
  };
}

interface PlaneBatteryEvent {
  eventName: 'PLANE_BATTERY';
  data: {
    battery: number;
  };
}

type WebSocketEvent = PlaneAngleEvent | PlaneSpeedEvent | PlaneBatteryEvent;

interface BatteryProps {
  batteryLevel: number;
}

interface PlaneProps {
  angle: number;
}

interface SpeedometerProps {
  speed: number;
}
