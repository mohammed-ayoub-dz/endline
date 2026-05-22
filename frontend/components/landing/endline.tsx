// components/Endline.tsx
import BackgroundVideo from '../ui/background-image';

export const Endline = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="mt-[15vh] ml-[10vh]  rounded-2xl px-8 py-4  hidden sm:block">
          <h1
            className="
              text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight
              text-white drop-shadow-lg
            "
          >
            Endline
          </h1>
        </div>
      </div>
    </div>
  );
};