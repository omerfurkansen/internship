import { useState, useEffect, useRef, memo } from 'react';
import BatterySvg from '../../../public/images/battery.svg';
import { RECT_GAP, RECT_HEIGHT, RECT_POSITION } from './constants';
import styles from './Battery.module.css';

const Battery: React.FC<BatteryProps> = memo(({ batteryLevel }) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const [blink, setBlink] = useState<boolean>(false);

  useEffect(() => {
    if (svgRef.current) {
      const rects = svgRef.current.getElementsByTagName('rect');
      const batteryItems = Array.from(rects);

      const calculateActiveBox = (level: number) => {
        const index = Math.floor(level / 25);
        const offset = level % 25;
        const activeBoxHeight = (RECT_HEIGHT * offset) / 24;
        const activePosition = RECT_POSITION + (3 - index) * RECT_GAP + (3 - index) * RECT_HEIGHT;
        return { activeBoxHeight, activePosition };
      };

      if (batteryLevel === 0) {
        rects[3].setAttribute('height', '0px');
      } else {
        const { activeBoxHeight, activePosition } = calculateActiveBox(batteryLevel);
        const activeRectIndex = 3 - Math.floor(batteryLevel / 25);
        rects[activeRectIndex]?.setAttribute('height', `${activeBoxHeight}px`);
        rects[activeRectIndex]?.setAttribute('y', `${activePosition + RECT_HEIGHT - activeBoxHeight}px`);

        const colorMap: { [key: number]: 'red' | 'yellow' | 'green' } = {
          0: 'red',
          1: 'yellow',
          2: 'green',
          3: 'green',
        };
        const color = colorMap[Math.floor(batteryLevel / 25)] || 'green';

        batteryItems.forEach((rect) => {
          rect.setAttribute('fill', color);
        });

        setBlink(batteryLevel < 20);
      }
    }
  }, [batteryLevel]);

  return (
    <div className={styles.batteryWrapper}>
      <div className={`${styles.batteryContainer} ${blink ? styles.blink : ''}`} ref={svgRef}>
        <BatterySvg className={styles.battery} />
        <span className={styles.batteryLevelLabel}>{batteryLevel + '%'}</span>
      </div>
    </div>
  );
});

export default Battery;
