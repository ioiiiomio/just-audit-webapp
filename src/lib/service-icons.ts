// src/lib/service-icons.ts
import {
  FileSearch,
  Calculator,
  Landmark,
  Code2,
  FolderArchive,
  BarChart2,
  FileText,
  Scale,
} from "lucide-react";

export const serviceIcons = {
  "financial-audit": FileSearch,
  "tax-audit": Calculator,
  "quasi-state-audit": Landmark,
  "astana-hub-audit": Code2,
  bookkeeping: FolderArchive,
  "financial-analysis": BarChart2,
  methodology: FileText,
  legal: Scale,
} as const;
