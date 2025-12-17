import { Info, AlertCircle, AlertTriangle, Lightbulb } from "lucide-react";

export const BlockAlert = ({ block }: { block: any }) => {
  let bg = "bg-gray-100";
  let border = "border-gray-300";
  let Icon = Info;

  switch (block.type) {
    case "INFO":
      bg = "bg-blue-50";
      border = "border-blue-400";
      Icon = Info;
      break;
    case "WARNING":
      bg = "bg-yellow-50";
      border = "border-yellow-400";
      Icon = AlertTriangle;
      break;
    case "ERROR":
      bg = "bg-red-50";
      border = "border-red-400";
      Icon = AlertCircle;
      break;
    case "TIPS":
      bg = "bg-green-50";
      border = "border-green-400";
      Icon = Lightbulb;
      break;
  }

  return (
    <div className={`flex items-start gap-2 p-4 border-l-4 ${border} rounded-md ${bg} mt-3`}>
      <Icon className='w-5 h-5 mt-1 flex-shrink-0' />
      <div>
        <p className='font-semibold'>{block.type}</p>
        <p className='text-gray-700'>{block.content}</p>
      </div>
    </div>
  );
};
