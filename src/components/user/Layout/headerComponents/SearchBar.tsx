import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedQuery(searchQuery);
        }, 300);
    
        return () => clearTimeout(handler);
      }, [searchQuery]);
    
      // Redirect when debouncedQuery updates
      useEffect(() => {
        if (debouncedQuery.trim()) {
          navigate(`/courses?search=${debouncedQuery}`);
        }else{
          navigate('/courses')
        }
      }, [debouncedQuery]);

  return (
    <div className="flex items-center gap-2">


      {/* Search Input */}
      <div
        className={`relative transition-all duration-300 ${
          isOpen ? "w-64 opacity-100" : "w-0 opacity-0"
        } overflow-hidden`}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-4 py-1 rounded-full opacity-30 text-gray-700 focus:outline-none transition"
        />
      </div>
            {/* Search Button */}
            <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white rounded-full bg-white bg-opacity-0 hover:bg-opacity-30 transition"
      >
        {isOpen ? <X size={20} /> : <Search size={20} />}
      </button>
    </div>
  );
}
