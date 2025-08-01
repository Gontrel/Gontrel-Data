export const ProgressBar = ({
  step,
  subTitle1 = "",
  subTitle2 = "",
  subTitle3 = "",
}: {
  step: number;
  subTitle1: string;
  subTitle2: string;
  subTitle3: string;
}) => {
  return (
    <div className="flex items-center space-x-2 my-6">
      <div
        className={`h-1.5 flex-1 rounded-full ${
          step >= 1
            ? "bg-gradient-to-r from-[#AF08FD] to-[#0070F3]"
            : "bg-gray-200"
        }`}
      >
        {step == 1 && (
          <p className="text-lg font-medium text-[#2E3032] text-center leading-[100%] mt-[10px]">
            {subTitle1}
          </p>
        )}
      </div>

      <div
        className={`h-1.5 flex-1 rounded-full ${
          step >= 2
            ? "bg-gradient-to-r from-[#AF08FD] to-[#0070F3]"
            : "bg-gray-200"
        }`}
      >
        {step == 2 && (
          <p className="text-lg font-medium text-[#2E3032] text-center  leading-[100%] mt-[10px]">
            {subTitle2}
          </p>
        )}
      </div>

      <div
        className={`h-1.5 flex-1 rounded-full ${
          step >= 3
            ? "bg-gradient-to-r from-[#AF08FD] to-[#0070F3]"
            : "bg-gray-200"
        }`}
      >
        {step == 3 && (
          <p className="text-lg font-medium text-[#2E3032] text-center  leading-[100%] mt-[10px]">
            {subTitle3}
          </p>
        )}
      </div>
    </div>
  );
};
