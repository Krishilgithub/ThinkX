"use client";

const companies = [
  "Stanford University",
  "Coursera",
  "Udemy",
  "Khan Academy",
  "Codecademy",
  "edX",
  "Harvard",
  "MIT",
  "Duolingo",
  "MasterClass",
];

export function Logos() {
  return (
    <section className="py-10 border-y border-zinc-100 bg-zinc-50/50">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-sm font-medium text-zinc-500 uppercase tracking-wider">
          Trusted by leading institutions
        </p>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {companies.map((company) => (
            <div
              key={company}
              className="text-xl font-bold font-heading text-zinc-400 hover:text-zinc-600 cursor-default"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
