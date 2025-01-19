const SkeletonContainers = () => {
  return (
    <div className="flex gap-4">
      {new Array(4).fill(null).map((_, index) => {
        return (
          <div
            key={index}
            className="w-72 max-w-96  rounded-md h-80 max-h-96 bg-neutral-400 shadow-xl p-1 flex flex-col border opacity-40 border-rose-500 animate-pulse gap-2 "
          >
            <div className="bg-neutral-500 w-full h-12 rounded-md animate-pulse"></div>
            <div className="bg-neutral-500 w-full h-12 rounded-md animate-pulse flex flex-grow "></div>
            <div className="bg-neutral-500 w-full h-12 rounded-md animate-pulse"></div>
          </div>
        );
      })}
    </div>
  );
};

export default SkeletonContainers;
