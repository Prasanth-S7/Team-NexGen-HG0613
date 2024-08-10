import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function PlaceSelector() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className={` rounded-lg transition-all py-2 text-left px-3 `} >Select a Location</button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] text-sm font-semibold">
                <div className="flex flex-col ">
                    <a
                        href="/pdrs"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all `}

                    >
                        hi
                    </a>
                    <a
                        href="/floodhub"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all `}

                    >
                        hello
                    </a>
                </div>
            </PopoverContent>
        </Popover>
    )
}