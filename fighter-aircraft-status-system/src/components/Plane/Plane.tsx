import { useEffect, useRef, memo } from 'react';
import PlaneSvg from '../../../public/images/plane.svg';
import styles from './Plane.module.css';

const Plane: React.FC<PlaneProps> = memo(({ angle }) => {
  const svgRef = useRef<HTMLDivElement>(null);

  const rotatePlane = (angle: number) => {
    if (svgRef.current) {
      svgRef.current.style.transform = `rotate(${angle}deg)`;
    }
  }

  useEffect(() => {
    rotatePlane(angle);
  }, [angle]);

  return (
    <div className={styles.planeWrapper}>
      <div ref={svgRef} className={styles.planeContainer}>
        <PlaneSvg className={styles.plane} />
      </div>
    </div>
  );
});

export default Plane;
