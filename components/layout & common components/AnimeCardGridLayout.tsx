import { PropsWithChildren } from "react";

const AnimeCardGridLayout = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="
            relative
        gap-5
        grid
        xxs: grid-cols-1   
        xs:grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6"
    >
      {children}
    </div>
  );
};

export default AnimeCardGridLayout;
