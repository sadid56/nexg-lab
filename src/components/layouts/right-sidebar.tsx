import RightSidebarContent from "./_components/RightSidebarContent";
import { Suspense } from "react";

const RightSidebar = async () => {
  return (
    <Suspense>
      <RightSidebarContent />
    </Suspense>
  );
};

export default RightSidebar;
