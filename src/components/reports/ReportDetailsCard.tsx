import React from "react";
import Image from "next/image";
import { ActionButtons } from "../ui/ActionButtons";
import { formatPostTime } from "@/lib/utils";

interface ReportUserDetailsProps {
  title: string;
  name?: string;
  avatar?: string;
  date?: string;
  comment?: string;
  status?: string;
  isUploader?: boolean;
}

const ReportUserDetail: React.FC<ReportUserDetailsProps> = ({ title, name, avatar, date, comment, status, isUploader }) => {
  let statusColor = "";
  if (status === "approved") {
    statusColor = "#E6F9E6";
  } else if (status === "declined") {
    statusColor = "#FDE6E6";
  }else{
    statusColor = "#F0F1F2"
  }

  const statusTextColor = status === "approved" ? "text-green-700" : status === "declined" ? "text-red-700" : "text-gray-800";
  const statusDotColor = status === "approved" ? "bg-green-500" : status === "declined" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className="bg-white p-10 rounded-lg shadow-sm">
      <h3 className="text-gray-500 mb-4">{title}</h3>
      <div className="flex items-start space-x-4">
        <Image
          src={avatar ?? "/images/location.png"}
          alt={name ?? "name"}
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-bold text-lg">{name}</p>
          {comment && <p className="text-gray-600">Comment: {comment}</p>}
          <p className="text-gray-500 text-sm"> {!isUploader ? "Date" : "Posted"}: {formatPostTime(date ?? "")}</p>
          {status && (
            <div className="flex items-center mt-2">
              <p className="text-gray-500 mr-2">Status:</p>
              <span className={`bg-[${statusColor}] ${statusTextColor} text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
                <span className={`w-2 h-2 mr-1 ${statusDotColor} rounded-full`}></span>
                {status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ReportDetailsCardProps {
  reporter: Omit<ReportUserDetailsProps, 'title'>;
  uploader: Omit<ReportUserDetailsProps, 'title' | 'comment' | 'status'>;
  onApprove?: () => void;
  onDecline?: () => void;
  status?: string;
}

export const ReportDetailsCard: React.FC<ReportDetailsCardProps> = ({ reporter, uploader, onApprove, onDecline, status }) => {
  const isPending = status === "pending";

  return (
    <div className="flex flex-col h-[90%] bg-white rounded-lg p-6">
      <div className="flex-1 space-y-6">
        <ReportUserDetail title="Reporter" {...reporter} status={status} />
        <ReportUserDetail title="Uploader" {...uploader} isUploader={true} />
      </div>

      {isPending && (
        <div className="">
          <ActionButtons
            actions={[
              {
                label: "Decline",
                onClick: () => onDecline?.(),
                variant: "success",
                active: true,
              },
              {
                label: "Approve",
                onClick: () => onApprove?.(),
                variant: "danger",
                active: true,
              },
            ]}
            className="w-full h-12"
          />
        </div>
      )}
    </div>
  );
};