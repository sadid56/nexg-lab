import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const NavbarSearchBox = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isSearching) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set("search", searchQuery);
        params.delete("page");
        router.replace(`/?${params.toString()}`, { scroll: false });
      } else {
        params.delete("search");
        params.delete("page");
        router.replace("/", { scroll: false });
      }

      setIsSearching(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, isSearching, router, searchParams]);

  return (
    <div className='relative'>
      <Input
        ref={inputRef}
        placeholder='Search...'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsSearching(true);
        }}
        className='w-full lg:w-[400px]'
      />

      <KbdGroup className='absolute right-3 top-2'>
        <Kbd>Ctrl + K</Kbd>
      </KbdGroup>
    </div>
  );
};

export default NavbarSearchBox;
