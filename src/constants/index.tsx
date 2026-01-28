import type { Window } from "./types";

export const navLinks = [
  {
    id: 1,
    title: "Project",
  },
  {
    id: 2,
    title: "Content",
  },
  {
    id: 3,
    title: "Resume",
  },
];

export const navIcons = [
  {
    id: 1,
    windowId: "wifi",
  },
  {
    id: 2,
    windowId: "search",
  },
  {
    id: 3,
    windowId: "user",
  },
  {
    id: 4,
    windowId: "mode",
  },
];

export const dockItems = [
  {
    id: 1,
    title: "Portfolio",
    windowId: "finder",
  },
  {
    id: 2,
    title: "Articles",
    windowId: "safari",
  },
  {
    id: 3,
    title: "Gallery",
    windowId: "photos",
  },
  {
    id: 4,
    title: "Contact",
    windowId: "contact",
  },
  {
    id: 5,
    title: "Skills",
    windowId: "terminal",
  },
  {
    id: 6,
    title: "Trash",
    windowId: "trash",
  },
];

export const INITIAL_WINDOW_Z_INDEX = 100;
export const WINDOW_CONFIG: Record<string, Window> = {
  finder: {
    isOpen: false,
    zIndex: INITIAL_WINDOW_Z_INDEX,
    data: { position: { x: 0, y: 0 } },
  },
  safari: {
    isOpen: false,
    zIndex: INITIAL_WINDOW_Z_INDEX,
    data: { position: { x: 0, y: 0 } },
  },
  photos: {
    isOpen: false,
    zIndex: INITIAL_WINDOW_Z_INDEX,
    data: { position: { x: 0, y: 0 } },
  },
  contact: {
    isOpen: false,
    zIndex: INITIAL_WINDOW_Z_INDEX,
    data: {
      position: { x: 100, y: 200 },
      width: 800,
      height: 400,
    },
  },
  terminal: {
    isOpen: false,
    zIndex: INITIAL_WINDOW_Z_INDEX,
    data: {
      position: { x: 0, y: 0 },
      width: 500,
      height: 500,
    },
  },
  trash: {
    isOpen: false,
    zIndex: INITIAL_WINDOW_Z_INDEX,
    data: { position: { x: 0, y: 0 } },
  },
};
