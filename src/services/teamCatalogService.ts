// src/services/teamCatalogService.ts
import type { League } from "../types/betting";

export interface CatalogTeam {
  name: string;
  abbreviation: string;
  league: League;
}

export interface TeamMatch {
  team: CatalogTeam;
  opponent: CatalogTeam;
  sport: League;
}

// A realistic catalog of real teams. This stands in for what would eventually
// be a live sports-data API response. The SHAPE of this data is what matters -
// swapping this for a real API later means the rest of the app is unaffected.
const TEAM_CATALOG: CatalogTeam[] = [
  // NBA
  { name: "Lakers", abbreviation: "LAL", league: "NBA" },
  { name: "Celtics", abbreviation: "BOS", league: "NBA" },
  { name: "Warriors", abbreviation: "GSW", league: "NBA" },
  { name: "Knicks", abbreviation: "NYK", league: "NBA" },
  { name: "Bucks", abbreviation: "MIL", league: "NBA" },
  { name: "Nuggets", abbreviation: "DEN", league: "NBA" },
  { name: "Heat", abbreviation: "MIA", league: "NBA" },
  { name: "Suns", abbreviation: "PHX", league: "NBA" },
  { name: "Mavericks", abbreviation: "DAL", league: "NBA" },
  { name: "76ers", abbreviation: "PHI", league: "NBA" },

  // NFL
  { name: "Chiefs", abbreviation: "KC", league: "NFL" },
  { name: "Falcons", abbreviation: "ATL", league: "NFL" },
  { name: "Cowboys", abbreviation: "DAL", league: "NFL" },
  { name: "Eagles", abbreviation: "PHI", league: "NFL" },
  { name: "49ers", abbreviation: "SF", league: "NFL" },
  { name: "Bills", abbreviation: "BUF", league: "NFL" },
  { name: "Ravens", abbreviation: "BAL", league: "NFL" },
  { name: "Bengals", abbreviation: "CIN", league: "NFL" },
  { name: "Dolphins", abbreviation: "MIA", league: "NFL" },
  { name: "Packers", abbreviation: "GB", league: "NFL" },

  // WNBA
  { name: "Liberty", abbreviation: "NYL", league: "WNBA" },
  { name: "Aces", abbreviation: "LVA", league: "WNBA" },
  { name: "Sky", abbreviation: "CHI", league: "WNBA" },
  { name: "Fever", abbreviation: "IND", league: "WNBA" },
  { name: "Storm", abbreviation: "SEA", league: "WNBA" },
  { name: "Sun", abbreviation: "CONN", league: "WNBA" },

  // MLB
  { name: "Yankees", abbreviation: "NYY", league: "MLB" },
  { name: "Red Sox", abbreviation: "BOS", league: "MLB" },
  { name: "Dodgers", abbreviation: "LAD", league: "MLB" },
  { name: "Braves", abbreviation: "ATL", league: "MLB" },
  { name: "Astros", abbreviation: "HOU", league: "MLB" },
  { name: "Mets", abbreviation: "NYM", league: "MLB" },
  { name: "Phillies", abbreviation: "PHI", league: "MLB" },
  { name: "Orioles", abbreviation: "BAL", league: "MLB" },
];

// Simple keyword-based search across name and abbreviation.
// This is intentionally basic - the interface (findTeamMatch's return shape)
// is what stays stable when we swap in a real search/NLP layer later.
export function findTeamMatch(query: string): TeamMatch | null {
  const q = query.toLowerCase();

  const team = TEAM_CATALOG.find(
    (t) => q.includes(t.name.toLowerCase()) || q.includes(t.abbreviation.toLowerCase())
  );

  if (!team) {
    return null;
  }

  const opponent = pickOpponent(team);

  return {
    team,
    opponent,
    sport: team.league,
  };
}

// Picks a plausible opponent from the same league, excluding the matched team itself.
function pickOpponent(team: CatalogTeam): CatalogTeam {
  const candidates = TEAM_CATALOG.filter(
    (t) => t.league === team.league && t.name !== team.name
  );
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

// Exposed for future features (e.g. autocomplete/search suggestions).
export function getAllTeams(): CatalogTeam[] {
  return TEAM_CATALOG;
}