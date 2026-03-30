import { useRouter } from "next/navigation";
import { ChevronLeft } from "@mui/icons-material";

export const Header = (props: { header: string }) => {
  const router = useRouter();

  return (
    <div className="flex py-5 w-full px-7 items-center cursor-pointer bg-white sticky top-0 shadow-md z-10">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="bg-neutral-100 rounded-full"
      >
        <ChevronLeft fontSize="small" className="m-1" />
      </button>

      <div className="my-auto mx-auto w-fit">
        <h4 className="font-semibold mr-4">{props.header}</h4>
      </div>
    </div>
  );
};
