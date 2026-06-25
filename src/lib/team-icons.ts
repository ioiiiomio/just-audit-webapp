// src/lib/team-icons.ts
import {
  Landmark,
  Briefcase,
  Award,
  ShieldCheck,
  Users,
  Presentation,
} from "lucide-react";

export const teamIcons = {
  building: Landmark,
  briefcase: Briefcase,
  certificate: Award,
  shield: ShieldCheck,
  users: Users,
  podium: Presentation,
} as const;
