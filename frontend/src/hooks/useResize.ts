import { RefObject, useEffect } from 'react';

declare global {
  interface Window {
    _scale?: number;
  }
}

const useResize = (
  wrapper: RefObject<HTMLDivElement>,
  wrapperContent: RefObject<HTMLDivElement>,
) => {
  useEffect(() => {
    const elHeight = wrapperContent.current?.offsetHeight;
    const elWidth = wrapperContent.current?.offsetWidth;

    const handleResize = () => {
      if (wrapper.current && wrapperContent.current && elHeight && elWidth) {
        const scale = Math.min(
          wrapper.current.offsetWidth / elWidth,
          wrapper.current.offsetHeight / elHeight,
        );

        window._scale = scale;

        const transformStyle = `translate(-50%, -50%) scale(${scale})`;
        wrapperContent.current.style.transform = transformStyle;
        
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
};

export default useResize;
