"use client";

import React, { useState } from "react";
import { Compass, MapPin, Layers, Info } from "lucide-react";
import { Project } from "@/data/profile";

interface LandStackCadastralPreviewProps {
  project: Project;
}

interface SampleParcel {
  id: string;
  code: string;
  type: string;
  area: string;
  status: string;
  colorClass: string;
}

const SAMPLE_PARCELS: SampleParcel[] = [
  {
    id: "parcel-a",
    code: "SAMPLE-TN-CHE-801",
    type: "Commercial Zone (Sample)",
    area: "2,400 sq.ft (illustrative)",
    status: "Boundary Verified (Demo)",
    colorClass: "stroke-emerald-500 fill-emerald-500/20"
  },
  {
    id: "parcel-b",
    code: "SAMPLE-TN-CHE-802",
    type: "Residential Zone (Sample)",
    area: "4,850 sq.ft (illustrative)",
    status: "Title Audit Ready (Demo)",
    colorClass: "stroke-emerald-600/70 fill-emerald-600/10"
  },
  {
    id: "parcel-c",
    code: "SAMPLE-TN-CHE-803",
    type: "Public Utility Zone (Sample)",
    area: "1,200 sq.ft (illustrative)",
    status: "Indexed (Demo)",
    colorClass: "stroke-teal-500/70 fill-teal-500/10"
  },
  {
    id: "parcel-d",
    code: "SAMPLE-TN-CHE-804",
    type: "Mixed Agricultural (Sample)",
    area: "3,600 sq.ft (illustrative)",
    status: "Pending Survey (Demo)",
    colorClass: "stroke-slate-400/60 fill-slate-400/5 dark:stroke-slate-600 dark:fill-slate-700/10"
  }
];

/**
 * Land Stack — Geospatial Cadastral Visualization
 * 
 * Renders an illustrative cadastral parcel boundary map and PostGIS vector indexing concept.
 * Communicates the platform's geospatial land governance concept with clear sample-data disclosures.
 */
export function LandStackCadastralPreview({ project }: LandStackCadastralPreviewProps) {
  const [selectedParcelId, setSelectedParcelId] = useState<string>("parcel-a");
  const selectedParcel = SAMPLE_PARCELS.find((p) => p.id === selectedParcelId) || SAMPLE_PARCELS[0];

  return (
    <div className="rounded-2xl bg-slate-50/80 dark:bg-[#070d12] p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Compass className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Cadastral Boundary Index</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              Conceptual Boundary Schema
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-300/60 dark:border-white/10">
          Illustrative Sample
        </span>
      </div>

      {/* SVG Cadastral Vector Grid Visualization */}
      <div className="relative rounded-xl bg-white dark:bg-[#04080c] p-3 border border-slate-200/70 dark:border-white/10 overflow-hidden">
        {/* Subtle Lat/Long Gridlines Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cadastral-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cadastral-grid)" />
          </svg>
        </div>

        {/* Interactive SVG Cadastral Parcel Boundaries */}
        <svg
          viewBox="0 0 320 160"
          className="w-full h-auto max-h-[170px] select-none"
          role="img"
          aria-label="Illustrative Cadastral Parcel Map Diagram"
        >
          {/* Parcel A (Highlighted) */}
          <polygon
            points="20,20 150,20 140,85 20,85"
            className={`cursor-pointer transition-all duration-200 stroke-2 ${
              selectedParcelId === "parcel-a"
                ? "stroke-emerald-400 fill-emerald-500/30 filter drop-shadow(0 0 6px rgba(16,185,129,0.3))"
                : "stroke-emerald-600/70 fill-emerald-600/10 hover:fill-emerald-500/20"
            }`}
            onClick={() => setSelectedParcelId("parcel-a")}
          />
          <text x="45" y="48" className="text-[9px] font-mono font-bold fill-slate-800 dark:fill-emerald-200 pointer-events-none">
            PARCEL #A
          </text>
          <text x="45" y="62" className="text-[8px] font-mono fill-emerald-700 dark:fill-emerald-400 pointer-events-none">
            2,400 sq.ft (sample)
          </text>

          {/* Parcel B */}
          <polygon
            points="155,20 300,20 300,90 145,90"
            className={`cursor-pointer transition-all duration-200 stroke-2 ${
              selectedParcelId === "parcel-b"
                ? "stroke-emerald-400 fill-emerald-500/30 filter drop-shadow(0 0 6px rgba(16,185,129,0.3))"
                : "stroke-emerald-700/60 fill-emerald-700/10 hover:fill-emerald-600/20"
            }`}
            onClick={() => setSelectedParcelId("parcel-b")}
          />
          <text x="180" y="48" className="text-[9px] font-mono font-bold fill-slate-800 dark:fill-emerald-200 pointer-events-none">
            PARCEL #B
          </text>
          <text x="180" y="62" className="text-[8px] font-mono fill-emerald-700 dark:fill-emerald-400 pointer-events-none">
            4,850 sq.ft (sample)
          </text>

          {/* Parcel C */}
          <polygon
            points="20,95 135,95 125,145 20,145"
            className={`cursor-pointer transition-all duration-200 stroke-2 ${
              selectedParcelId === "parcel-c"
                ? "stroke-emerald-400 fill-emerald-500/30 filter drop-shadow(0 0 6px rgba(16,185,129,0.3))"
                : "stroke-teal-600/60 fill-teal-600/10 hover:fill-teal-500/20"
            }`}
            onClick={() => setSelectedParcelId("parcel-c")}
          />
          <text x="40" y="122" className="text-[9px] font-mono font-bold fill-slate-800 dark:fill-teal-200 pointer-events-none">
            PARCEL #C
          </text>

          {/* Parcel D */}
          <polygon
            points="140,98 300,98 300,145 130,145"
            className={`cursor-pointer transition-all duration-200 stroke-2 ${
              selectedParcelId === "parcel-d"
                ? "stroke-emerald-400 fill-emerald-500/30 filter drop-shadow(0 0 6px rgba(16,185,129,0.3))"
                : "stroke-slate-400/60 fill-slate-400/10 dark:stroke-slate-600 dark:fill-slate-800/30 hover:fill-slate-500/20"
            }`}
            onClick={() => setSelectedParcelId("parcel-d")}
          />
          <text x="175" y="122" className="text-[9px] font-mono font-bold fill-slate-800 dark:fill-slate-300 pointer-events-none">
            PARCEL #D (Sample)
          </text>
        </svg>

        {/* Selected Sample Telemetry Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedParcel.code}</span>
          </div>
          <span className="text-slate-500 dark:text-slate-400">{selectedParcel.type}</span>
        </div>
      </div>

      {/* Cadastral Legend & Truthful Disclaimer */}
      <div className="space-y-1.5 pt-1">
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500" />
            <span>Active Parcel Boundary</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-800/20 border border-emerald-700/50" />
            <span>Adjacent Polygons</span>
          </span>
        </div>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
          * Illustrative cadastral boundary geometry for architectural concept exploration. Does not reflect real property records or live GIS survey data.
        </p>
      </div>
    </div>
  );
}
