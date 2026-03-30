"use client";
import { SettingsRounded, CalendarMonthRounded } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";

type sidebarType = {
  label: string;
  icon: React.ReactElement;
  route: string;
};
export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const fontSize = "large";
  const iconStyle = "m-1";
  const sidebar: sidebarType[] = [
    {
      label: "Schedule",
      icon: <CalendarMonthRounded fontSize={fontSize} className={iconStyle} />,
      route: "/admin/schedule",
    },
    {
      label: "Settings",
      icon: <SettingsRounded fontSize={fontSize} className={iconStyle} />,
      route: "/admin/dashboard",
    },
  ];
  return (
    <nav className="p-4 bg-white shadow-md w-fit rounded-2xl h-fit">
      <img src="/booking-logo.png" alt="Logo" className="h-12" />
      <div className="my-6">
        {sidebar.map((item, index) => (
          <div key={index} className="mx-auto w-fit my-4 cursor-pointer">
            <div
              className={`mx-auto w-fit rounded-lg  ${
                pathname === item.route
                  ? "bg-linear-to-r from-primary-1 to-primary-3 text-white"
                  : "text-primary-2/80 hover:text-primary-2 hover:bg-primary-1/10 transition-colors duration-200"
              }`}
              onClick={() => router.push(item.route)}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};
