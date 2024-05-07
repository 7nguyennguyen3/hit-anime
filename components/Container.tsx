import React, { PropsWithChildren } from "react";

const Container = ({ children }: PropsWithChildren) => {
  return <div className="p-5 max-w-[1400px] m-auto">{children}</div>;
};

export default Container;
