import { memo } from 'react';
import SpeedometerCircleSvg from '../../../public/images/speedometer-circle.svg';
import SpeedometerArrowSvg from '../../../public/images/speedometer-arrow.svg';
import styles from './Speedometer.module.css';

const Speedometer: React.FC<SpeedometerProps> = memo(({ speed }) => {
  const rotation = -150 + speed * 3;

  return (
    <div className={styles.speedometerWrapper}>
      <div className={styles.speedometerContainer}>
        <SpeedometerCircleSvg className={styles.speedometerCircle} />
        <SpeedometerArrowSvg className={styles.speedometerNeedle} style={{ transform: `rotate(${rotation}deg)` }} />
        <span className={styles.speedometerLabel}>{speed} km/h</span>
      </div>
    </div>
  );
});

export default Speedometer;
