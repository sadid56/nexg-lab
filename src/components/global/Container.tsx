import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div {...rest} className={cn(className, "max-w-[1380px] px-4 mx-auto")}>
      {children}
    </div>
  );
};

export default Container;
