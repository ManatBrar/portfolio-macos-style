import dayjs from "dayjs";

import { memo, useEffect, useState } from "react";
import { navIcons, navLinks } from "../constants";

const Navbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <nav>
      <div className="flex items-center justify-between px-3 py-2 bg-white/50 backdrop-blur-3xl gap-4 z-top">
        <div className="flex-center gap-4">
          <img src="images/logo.svg" alt="apple" />
          <div className="text-m font-bold">{import.meta.env.VITE_TITLE}</div>
          <ul className="flex-center gap-4">
            {navLinks.map((link) => (
              <li key={link.id}>
                <p className="text-sm hover:cursor-pointer hover:underline">
                  {link.title}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-center gap-4">
          <ul className="flex-center gap-4">
            {navIcons.map((icon) => (
              <li
                key={icon.id}
                className="hover:cursor-pointer hover:bg-white/50 rounded-full p-1"
              >
                <img src={`icons/${icon.windowId}.svg`} alt={icon.windowId} />
              </li>
            ))}
          </ul>
          <div className="text-sm">
            {dayjs(time).format("ddd DD MMM hh:mm A")}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
