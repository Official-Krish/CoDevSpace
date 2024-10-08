import React from "react";
import { CameraIcon, EllipsisVertical } from "lucide-react";
import { toJpeg } from "html-to-image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export default function CodeSnippet({
  reff,
}: {
  reff: React.RefObject<HTMLDivElement>;
}) {
    const handleTakeScreenshot = async () => {
        const node = reff.current;
        if (!node) return;
        try {
            const url = await toJpeg(node);
            console.log(url);
            const downloadImage = () => {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'screenshot.jpeg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            downloadImage();
        } catch (error) {
            console.log(error)
        }
    };
    return (
        <button className="flex hover:text-gray-400" onClick={handleTakeScreenshot}>
            <CameraIcon
                className="shadow-lg"/>
            <div className="pl-2 pr-1 font-semibold text-md">Save</div>
        </button>
    );
}


export const RoomDropDown = ({reff} : {reff: React.RefObject<HTMLDivElement>}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="h-5 w-5 text-gray-400 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-gray-600 rounded-md shadow-lg py-2 pr-[-10px] pl-2">
                <DropdownMenuItem>
                    <div className="text-white pl-1 flex">
                        <CodeSnippet reff={reff} />
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}