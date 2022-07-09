import { memo } from "react";

const WalletCard = ({ color, title, subtitle, icon }) => {
  return (
    <div className="flex flex-row items-center justify-start p-3 m-2 cursor-pointer white-glassmorphism hover:shadow-xl">
      <div
        className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}
      >
        {icon}
      </div>
      <div className="flex flex-col flex-1 ml-5">
        <h1 className="mt-2 text-lg text-white">{title}</h1>
        <p className="mt-2 text-sm text-white md:w-9/12">{subtitle}</p>
      </div>
    </div>
  );
};

export default memo(WalletCard);
