import { useEffect, useRef } from 'react';

export default function useInterval(callback, delay) {
    const savedCallback = useRef();
    // Remember latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Setup interval
    // eslint-disable-next-line consistent-return
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [callback, delay]);
}
