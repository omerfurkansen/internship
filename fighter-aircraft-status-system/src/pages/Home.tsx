import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";
import { SOCKET_URL } from "../config";
import { Plane, Battery, Speedometer } from "../components";
import styles from './Home.module.css';

const Home: React.FC = () => {
  const { data, sendMessage } = useWebSocket(SOCKET_URL);

  const [planeAngle, setPlaneAngle] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [batteryLevel, setBatteryLevel] = useState<number>(100);

  useEffect(() => {
    if (data) {
      switch (data.eventName) {
        case 'PLANE_ANGLE':
          setPlaneAngle(data.data.angle);
          break;
        case 'PLANE_SPEED':
          setSpeed(data.data.speed);
          break;
        case 'PLANE_BATTERY':
          setBatteryLevel(data.data.battery);
          break;
        default:
          break;
      }
    }
  }, [data]);

  return (
    <>
      <Plane angle={planeAngle} />
      <Battery batteryLevel={batteryLevel} />
      <Speedometer speed={speed} />
      <div className={styles.buttonContainer}>
        <button onClick={() => sendMessage('START')}>Start</button>
        <button onClick={() => sendMessage('STOP')}>Stop</button>
      </div>
    </>
  );
}

export default Home;