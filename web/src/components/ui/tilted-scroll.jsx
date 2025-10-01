import { cn } from "../../lib/utils"

export function TiltedScroll({
  items = defaultItems,
  className
}) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_5rem),linear-gradient(to_left,transparent,black_5rem),linear-gradient(to_bottom,transparent,black_5rem),linear-gradient(to_top,transparent,black_5rem)]">
        <div className="grid h-[250px] w-[300px] gap-5 animate-skew-scroll grid-cols-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 cursor-pointer rounded-md border border-gray-300 bg-gradient-to-b from-white to-gray-50 p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-xl"
            >
              <CheckCircleIcon className="h-6 w-6 mr-2 stroke-gray-500 transition-colors group-hover:stroke-green-600" />
              <p className="text-gray-700 transition-colors group-hover:text-gray-900">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CheckCircleIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

const defaultItems = [
  { id: "1", text: "100% Client-Side Processing" },
  { id: "2", text: "Automatic Config Conversion" },
  { id: "3", text: "Environment Variables Migration" },
  { id: "4", text: "Framework-Specific Checklists" },
  { id: "5", text: "Docker Isolated Environment" },
  { id: "6", text: "Netlify CLI Commands" },
  { id: "7", text: "Zero Config Setup" },
  { id: "8", text: "Secure & Private" },
]
