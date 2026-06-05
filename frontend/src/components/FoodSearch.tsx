import { useEffect, useRef, useState } from "react";
import { Search, Flame } from "lucide-react";
import { searchTacoFoods, type TacoFood } from "../data/taco_foods";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (food: TacoFood) => void;
  placeholder?: string;
  className?: string;
};

export default function FoodSearch({ value, onChange, onSelect, placeholder = "Alimento / descrição", className = "" }: Props) {
  const [results, setResults] = useState<TacoFood[]>([]);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) setResults(searchTacoFoods(value));
    else setResults([]);
  }, [value, focused]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showDropdown = focused && results.length > 0;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="w-full h-9 pl-8 pr-3 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {showDropdown && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden">
          {results.map((food) => (
            <button
              key={food.name}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onSelect(food); setFocused(false); }}
              className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-orange-50 transition text-left border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{food.name}</p>
                <p className="text-[10px] text-gray-400">
                  Padrão: {food.default_qty}{food.default_unit !== "g" && food.default_unit !== "ml" ? " " : ""}{food.default_qty !== 1 ? food.default_unit : food.default_unit}
                  <span className="ml-1 text-gray-300">· {food.category}</span>
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-0.5 text-[10px] text-orange-400 font-semibold">
                <Flame className="h-3 w-3" />
                {Math.round(food.kcal * food.default_qty / 100)} kcal
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
