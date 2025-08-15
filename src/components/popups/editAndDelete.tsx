import React from "react";
import { Button, Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Icon from "../svgs/Icons";

interface EditDeletePopupProps {
  onEdit: () => void;
  onDelete: () => void;
  triggerElement?: React.ReactNode;
}

const EditDeletePopup: React.FC<EditDeletePopupProps> = ({
  onEdit,
  onDelete,
  triggerElement = (
    <Button
      type="text"
      icon={<MoreOutlined />}
      className="text-gray-500 hover:text-gray-700"
    />
  ),
}) => {
  const content = (
    <div className="flex flex-col justify-center gap-y-4 items-start min-w-[220px]  min-h-[110px] overflow-y-auto">
      <div className="flex items-center justify-between w-full bg-[#E6F1FE] hover:bg-gray-300 rounded-[10px] py-[14px] px-[20px]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center text-left gap-x-2 width-full"
        >
          <Icon name="pencilIcon" stroke="#24B314" />
          <span className="text-[17px] text-[#2E3032] leading-[100%] font-medium">
            {" "}
            Edit video
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between w-full bg-[#FDE6E6] hover:bg-red-200 rounded-[10px] py-[14px] px-[20px] ">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center text-left gap-x-2 width-full"
        >
          <Icon name="binIcon" stroke="#24B314" />
          <span className="text-[17px] text-[#2E3032] leading-[100%] font-medium">
            {" "}
            Delete video{" "}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="topLeft"
      className="edit-delete-popover"
      arrow={false}
    >
      {triggerElement}
    </Popover>
  );
};

export default EditDeletePopup;
