type SectionType = "movies" | "rooms" | "shows" | "reviews" | "employees";

type Props = {
  activeSection: SectionType;
  onSelect: (section: SectionType) => void;
  role: string;
};

export default function AsideBackOffice({
  activeSection,
  onSelect,
  role,
}: Props) {
  return (
    <aside className="border-r border-gray-300 p-4 w-48">
      <nav>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              onClick={() => onSelect("movies")}
              className={`w-full text-left px-2 py-1 h-auto ${
                activeSection === "movies"
                  ? "bg-secondary text-primary"
                  : "hover:bg-gray-400"
              }`}
            >
              🎬 Films
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelect("rooms")}
              className={`w-full text-left px-2 py-1 h-auto  ${
                activeSection === "rooms"
                  ? "bg-secondary text-primary"
                  : "hover:bg-gray-400"
              }`}
            >
              🏢 Salles
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelect("shows")}
              className={`w-full text-left px-2 py-1 h-auto  ${
                activeSection === "shows"
                  ? "bg-secondary text-primary"
                  : "hover:bg-gray-400"
              }`}
            >
              🎥 Séances
            </button>
          </li>
          {role === "ADMIN" && (
            <li>
              <button
                onClick={() => onSelect("employees")}
                className={`w-full text-left px-2 py-1 h-auto  ${
                  activeSection === "employees"
                    ? "bg-secondary text-primary"
                    : "hover:bg-gray-400"
                }`}
              >
                👤 Employés
              </button>
            </li>
          )}
          {role === "EMPLOYEE" && (
            <li>
              <button
                onClick={() => onSelect("reviews")}
                className={`w-full text-left px-2 py-1 h-auto  ${
                  activeSection === "reviews"
                    ? "bg-secondary text-primary"
                    : "hover:bg-gray-400"
                }`}
              >
                🗣️ Avis
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
