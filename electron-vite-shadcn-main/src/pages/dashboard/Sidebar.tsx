import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  CubeTransparentIcon,
  HomeIcon,
  CurrencyEuroIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import { LogOut, PackagePlus } from "lucide-react";

// Import your components
import Dashboard from "./Dashboard";
import DevisLandingPage from "../devis/devisLandingPage";
import ClientsLandingPage from "../clients/clientsLandingPage";
import FournisseursLandingPage from "../fournisseurs/fournisseursLandingPage";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, component: "Dashboard" },
  { name: "Clients", href: "#", icon: UserGroupIcon, component: "Clients" },
  {
    name: "Fournisseurs",
    href: "#",
    icon: BuildingOffice2Icon,
    component: "Suppliers",
  },
  {
    name: "Commande Client",
    href: "#",
    icon: PackagePlus,
    component: "CommandeClient",
  },
  {
    name: "Devis et Facture",
    href: "#",
    icon: CurrencyEuroIcon,
    component: "Devis",
  },
  {
    name: "Outils",
    href: "/outils",
    icon: WrenchScrewdriverIcon,
    component: "Outils",
  },
  {
    name: "Planning",
    href: "#",
    icon: CalendarDaysIcon,
    component: "Planning",
  },
  { name: "Pièces", href: "#", icon: CubeTransparentIcon, component: "Pieces" },
  { name: "Reports", href: "#", icon: ChartPieIcon, component: "Reports" },
];
const userNavigation = [
  { name: "Mon profile", href: "#" },
  { name: "Se déconnecter", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState("");
  const [userName, setUserName] = useState({ firstname: "", lastname: "" });
  const [currentView, setCurrentView] = useState("Dashboard"); // New state to manage current view

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token is missing");
        }

        const response = await fetch(`http://localhost:3000/api/user-photo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const result = await response.json();

        if (result.photo) {
          setUserPhoto(`data:image/jpeg;base64,${result.photo}`);
          setUserName({
            firstname: result.firstname,
            lastname: result.surname,
          });
        } else {
          throw new Error("No photo found in response");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "Dashboard":
        return <Dashboard />;
      case "Devis":
        return <DevisLandingPage />;
      case "Clients":
        return <ClientsLandingPage />;
      case "Suppliers":
        return <FournisseursLandingPage />;
      // Add more cases for other components
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="CRP-Nexus Logo"
                    src="../src/assets/CRPL1.svg"
                    className="h-8 w-auto"
                  />
                  <div className="ml-4 text-white font-bold">CRP-Nexus</div>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-2">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              onClick={() => setCurrentView(item.component)} // Set the current view on click
                              className={classNames(
                                currentView === item.component
                                  ? "bg-purple-950 text-white"
                                  : "text-white hover:bg-purple-950 animate-in duration-150 bg-purple-700",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0"
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>

                    <li className="mt-auto">
                      <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-900 hover:text-white"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0"
                        />
                        Paramètres
                      </a>
                      <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-900 hover:text-white"
                        onClick={handleSignOut}
                      >
                        <LogOut
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0"
                        />
                        Quitter la session
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}

        <div className="">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-500"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div aria-hidden="true" className="h-6 w-px bg-gray-900/10" />

            <div className="flex flex-1 gap-x-4 self-stretch">
              <form action="#" method="GET" className="relative flex flex-1">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  placeholder="Search..."
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-50 placeholder:text-gray-50 bg-gray-900 focus:ring-0 sm:text-sm"
                />
              </form>
              <div className="flex items-center gap-x-4">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={
                        userPhoto
                          ? userPhoto
                          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      className="h-8 w-8 rounded-full bg-gray-900"
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm font-semibold leading-6 text-gray-50"
                      >
                        {`${userName.firstname} ${userName.lastname}`}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-gray-900 py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          onClick={
                            item.name === "Se déconnecter"
                              ? handleSignOut
                              : null
                          }
                          className="block px-3 py-1 text-sm leading-6 text-gray-50 data-[focus]:bg-gray-900"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-8">
            <div className="px-4 sm:px-6 lg:px-8">{renderCurrentView()}</div>
          </main>
        </div>
      </div>
    </>
  );
}
