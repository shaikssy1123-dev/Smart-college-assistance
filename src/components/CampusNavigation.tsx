import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Compass,
  Monitor,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Coffee,
  BookOpen,
  ArrowRight,
  Info,
  Navigation2
} from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/mockData';
import { CampusBuilding, CampusRoom } from '../types';

export const CampusNavigation: React.FC = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('bld_comp_b');
  const [selectedFloor, setSelectedFloor] = useState<number>(3);
  const [filterMode, setFilterMode] = useState<'all' | 'free_only' | 'labs_only' | 'study_only'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [routeDestination, setRouteDestination] = useState<string | null>(null);

  const activeBuilding = useMemo(() => {
    return CAMPUS_BUILDINGS.find(b => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];
  }, [selectedBuildingId]);

  // Adjust floor if active building doesn't have the selected floor
  const currentFloorData = useMemo(() => {
    const found = activeBuilding.floors.find(f => f.floorNumber === selectedFloor);
    return found || activeBuilding.floors[0];
  }, [activeBuilding, selectedFloor]);

  // Filtered rooms list
  const filteredRooms = useMemo(() => {
    let list = currentFloorData.rooms;

    if (filterMode === 'free_only') {
      list = list.filter(r => r.isFree);
    } else if (filterMode === 'labs_only') {
      list = list.filter(r => r.type === 'lab');
    } else if (filterMode === 'study_only') {
      list = list.filter(r => r.type === 'study_lounge');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.roomNumber.toLowerCase().includes(q) ||
          r.facilities.some(f => f.toLowerCase().includes(q))
      );
    }

    return list;
  }, [currentFloorData, filterMode, searchQuery]);

  // Overall campus live summary
  const campusSummary = useMemo(() => {
    let totalRooms = 0;
    let freeRooms = 0;
    let totalLabDesks = 0;
    let freeLabDesks = 0;

    CAMPUS_BUILDINGS.forEach(b => {
      b.floors.forEach(f => {
        f.rooms.forEach(r => {
          totalRooms++;
          if (r.isFree) freeRooms++;
          if (r.type === 'lab') {
            totalLabDesks += r.capacity;
            freeLabDesks += Math.max(0, r.capacity - r.occupied);
          }
        });
      });
    });

    return { totalRooms, freeRooms, totalLabDesks, freeLabDesks };
  }, []);

  return (
    <div id="campus-navigation" className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              Live Campus Map & Real-Time Lab Tracker
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Interactive Campus Navigation & Space Occupancy
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Locate open computer terminals, GPU clusters, quiet research carrels, and vacant lecture halls across all university blocks in real time.
            </p>
          </div>

          {/* Live Quick Counters */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Available Rooms</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                {campusSummary.freeRooms} / {campusSummary.totalRooms}
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-center">
              <div className="text-[11px] uppercase tracking-wider text-cyan-300">Free Lab Desks</div>
              <div className="text-2xl font-extrabold font-mono text-cyan-300">
                {campusSummary.freeLabDesks} PCs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Map & Building Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive SVG Campus Map */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                University Campus Layout (Interactive)
              </h3>
              <span className="text-[11px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Live GPS Sync
              </span>
            </div>

            {/* Simulated Visual Campus Map Canvas */}
            <div className="relative w-full h-72 rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden select-none">
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              
              {/* Walkways and pathways */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/20 stroke-2 stroke-dasharray-4">
                <line x1="28%" y1="35%" x2="55%" y2="25%" stroke="rgba(6, 182, 212, 0.3)" strokeDasharray="4 4" />
                <line x1="28%" y1="35%" x2="42%" y2="65%" stroke="rgba(6, 182, 212, 0.3)" strokeDasharray="4 4" />
                <line x1="55%" y1="25%" x2="75%" y2="55%" stroke="rgba(6, 182, 212, 0.3)" strokeDasharray="4 4" />
                <line x1="42%" y1="65%" x2="75%" y2="55%" stroke="rgba(6, 182, 212, 0.3)" strokeDasharray="4 4" />
                {/* Main Entrance Road */}
                <path d="M 50% 100% L 50% 70% L 42% 65%" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="4" />
              </svg>

              {/* Buildings on the Map */}
              {CAMPUS_BUILDINGS.map(bld => {
                const isSelected = selectedBuildingId === bld.id;
                return (
                  <button
                    key={bld.id}
                    onClick={() => {
                      setSelectedBuildingId(bld.id);
                      setSelectedFloor(bld.floors[0].floorNumber);
                    }}
                    style={{ left: `${bld.coordinates.x}%`, top: `${bld.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl text-left transition-all z-20 group ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold scale-110 shadow-lg shadow-cyan-500/50 ring-2 ring-white'
                        : 'bg-slate-900/90 border border-slate-700 text-slate-200 hover:border-cyan-400 hover:scale-105 shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-cyan-400'}`} />
                      <span className="text-[11px] font-semibold whitespace-nowrap">{bld.code}</span>
                    </div>
                  </button>
                );
              })}

              {/* You are Here Marker */}
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900/90 px-2 py-1 rounded-md border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>You are at: Student Central</span>
              </div>
            </div>

            {/* Building Selection Tabs */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs text-slate-400 font-medium">Campus Buildings:</span>
              <div className="grid grid-cols-2 gap-2">
                {CAMPUS_BUILDINGS.map(bld => {
                  const isSelected = selectedBuildingId === bld.id;
                  return (
                    <button
                      key={bld.id}
                      onClick={() => {
                        setSelectedBuildingId(bld.id);
                        setSelectedFloor(bld.floors[0].floorNumber);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition text-xs ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-white font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="font-semibold text-[11px] text-cyan-400 truncate">{bld.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{bld.category} • {bld.floors.length} Floors</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Route Guidance */}
          {routeDestination && (
            <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 text-xs space-y-2">
              <div className="flex items-center justify-between text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Navigation2 className="w-4 h-4 text-cyan-400" />
                  Turn-by-Turn Wayfinding
                </span>
                <button
                  onClick={() => setRouteDestination(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="text-slate-200">
                Destination: <strong className="text-white">{routeDestination}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div>1. From Main Plaza, take the North covered walkway toward {activeBuilding.code}.</div>
                <div>2. Take the central elevator/stairs to Floor {currentFloorData.floorNumber}.</div>
                <div>3. Turn right down the hallway; door will be marked on the left (Est. 3 mins walk).</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Floor & Rooms Occupancy Tracker */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            {/* Top Toolbar: Search & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              {/* Floor switcher */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">
                  Floor:
                </span>
                {activeBuilding.floors.map(f => (
                  <button
                    key={f.floorNumber}
                    onClick={() => setSelectedFloor(f.floorNumber)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      currentFloorData.floorNumber === f.floorNumber
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {f.floorName}
                  </button>
                ))}
              </div>

              {/* Filter mode pill */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(['all', 'free_only', 'labs_only', 'study_only'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition capitalize whitespace-nowrap ${
                      filterMode === mode
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'all'
                      ? 'All Rooms'
                      : mode === 'free_only'
                      ? 'Open Now'
                      : mode === 'labs_only'
                      ? 'Labs'
                      : 'Study Lounges'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search within floor */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rooms, GPU models, projector, quiet zones..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Rooms Cards Grid */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredRooms.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl">
                  No rooms matching your filter criteria on this floor.
                </div>
              ) : (
                filteredRooms.map(room => {
                  const freeDesks = Math.max(0, room.capacity - room.occupied);
                  const occupancyPct = Math.round((room.occupied / room.capacity) * 100);

                  return (
                    <div
                      key={room.id}
                      className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-1 rounded-md text-xs">
                            {room.roomNumber}
                          </span>
                          <div>
                            <div className="font-semibold text-white text-sm">{room.name}</div>
                            <div className="text-[11px] text-slate-400 capitalize">
                              {room.type.replace('_', ' ')} • Capacity: {room.capacity} seats
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          {room.isFree ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Open & Free
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <XCircle className="w-3.5 h-3.5" />
                              Occupied
                            </span>
                          )}

                          <button
                            onClick={() => setRouteDestination(`${room.roomNumber} - ${room.name}`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1"
                          >
                            <span>Route</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Occupancy gauge */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">
                            Occupancy: <strong className="text-white">{room.occupied}</strong> / {room.capacity}
                          </span>
                          <span className="font-mono text-cyan-400">
                            {freeDesks} seats available ({occupancyPct}% full)
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              occupancyPct > 80
                                ? 'bg-rose-500'
                                : occupancyPct > 50
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                            style={{ width: `${occupancyPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Current activity & Facilities Chips */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
                        <div className="text-slate-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate max-w-xs">{room.currentActivity}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {room.facilities.map((fac, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/50"
                            >
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
