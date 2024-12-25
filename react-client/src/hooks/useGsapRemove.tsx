import {useRef} from 'react';
import {gsap} from 'gsap'

export const useGsapRemove = () => {
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const addElement = (id: number, el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(id, el);
  };
  const removeElements = (ids: number[], onComplete?: (id: number) => void) => {
    ids.forEach((id) => {
      const element = itemRefs.current.get(id);
      if (element) {
        gsap.to(element, {
          x: 300,
          onComplete: () => {
            itemRefs.current.delete(id);
            if (onComplete) onComplete(id);
          },
        });
      }
    });
  }
  return {addElement, removeElements}
}