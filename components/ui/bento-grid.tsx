import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  gradient = "from-blue-500 to-sky-500",
}: {
  className?: string
  title?: string | ReactNode
  description?: string | ReactNode
  header?: ReactNode
  icon?: ReactNode
  gradient?: string
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 overflow-hidden relative",
        className
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover/bento:opacity-5 transition duration-200", gradient)} />
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  )
}
