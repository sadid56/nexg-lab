import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const NavbarSearchBox = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set("search", searchQuery);
        router.replace(`/?${params.toString()}`, { scroll: false });
      } else {
        params.delete("search");
        router.replace("/", { scroll: false });
      }

      setIsSearching(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, isSearching, router, searchParams, setIsSearching]);

  return (
    <div>
      <Input
        placeholder='Search...'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsSearching(true);
        }}
        className='w-64 sm:w-full'
      />
    </div>
  );
};

export default NavbarSearchBox;
