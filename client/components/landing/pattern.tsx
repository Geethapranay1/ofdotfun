import React from "react";

export default function Pattern() {
  return (
    <>
      <div className="absolute top-0 -left-10 w-10 h-full pointer-events-none border-l bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:border-x-[#ffffff1a] dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)]" />
      <div className="absolute top-0 -right-10 w-10 h-full pointer-events-none border-r bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:border-x-[#ffffff1a] dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)]" />
    </>
  );
}
