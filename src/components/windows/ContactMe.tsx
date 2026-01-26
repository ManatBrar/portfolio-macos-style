import WindowControls from "@/components/common/WindowControls";
import WindowWrapper from "@/hoc/WindowWrapper";
import { memo } from "react";

const WINDOW_ID = "contact";
const ContactMe = ({ parentRef, positionRef }: any) => {
  return (
    <>
      <div className="flex gap-2 bg-gray-50 p-3 rounded-t-2xl">
        <WindowControls
          windowId={WINDOW_ID}
          parentRef={parentRef}
          positionRef={positionRef}
        />
        <p className="flex-1 text-center font-bold text-sm">Contact Me</p>
      </div>
      <div className="border-b border-gray-200"></div>
    </>
  );
};

const ContactMeWrapper = WindowWrapper(ContactMe, WINDOW_ID);

export default memo(ContactMeWrapper);
