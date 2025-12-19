import NavbarContent from "./_components/NavbarContent";
import { GetCurrentUser } from "@/actions/auth-actions";

export const dynamic = "force-cache";

const Navbar = async () => {
  const user: any = await GetCurrentUser();

  return <NavbarContent user={user ?? null} />;
};

export default Navbar;
