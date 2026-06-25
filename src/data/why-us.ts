// src/data/why-us.ts
import { Clock, Scale, ClipboardList, Lock, Target } from "lucide-react";

export const trustPoints = [
  { id: "experience", icon: Clock },
  { id: "independence", icon: Scale },
  { id: "compliance", icon: ClipboardList },
  { id: "confidentiality", icon: Lock },
  { id: "expertise", icon: Target },
] as const;
