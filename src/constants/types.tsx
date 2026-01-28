export type Window = {
  isOpen: boolean;
  zIndex: number;
  data: {
    position?: { x: number; y: number };
    width?: number;
    height?: number;
    isFullscreen?: boolean;
  };
};
