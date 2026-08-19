import { Reveal } from "./Reveal";

export const SectionHeading = ({ number, title, highlight, subtitle }) => (
  <Reveal className="mb-12 md:mb-16">
    <div className="flex items-end gap-4 md:gap-6">
      <span className="font-display text-5xl md:text-7xl font-black leading-none text-stroke-volt select-none">
        {number}
      </span>
      <div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {title} {highlight && <span className="text-volt">{highlight}</span>}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="mt-6 h-px w-full bg-gradient-to-r from-volt/60 via-white/10 to-transparent" />
  </Reveal>
);
