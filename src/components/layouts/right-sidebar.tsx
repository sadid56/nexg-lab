import RightSidebarContent from "./_components/RightSidebarContent";
import { Suspense } from "react";

const RightSidebar = () => {
  return (
    <Suspense>
      <RightSidebarContent />
    </Suspense>
  );
};

export default RightSidebar;
