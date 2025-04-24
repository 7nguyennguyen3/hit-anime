import { PropsWithChildren } from "react";

const AnimeCardGridLayout = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="
            relative
        gap-5
        grid
        xxs: grid-cols-2   
        xs:grid-cols-3 
        sm:grid-cols-3 
        md:grid-cols-4
        lg:grid-cols-4
        xl:grid-cols-5"
    >
      {children}
    </div>
  );
};

export default AnimeCardGridLayout;
