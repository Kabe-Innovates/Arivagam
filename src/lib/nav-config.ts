import {
  Calendar,
  Megaphone,
  Star,
  FileText,
  CheckSquare,
  Ticket,
  Wrench,
  Users,
  Heart,
  User,
} from "lucide-react";
import type { NavSection } from "@/types/nav";

export const navSections: NavSection[] = [
  {
    title: "Core",
    items: [
      { title: "Schedule", href: "/dashboard/schedule", icon: Calendar },
      { title: "Circulars", href: "/dashboard/circulars", icon: Megaphone },
      { title: "My Reward Points", href: "/dashboard/rewards", icon: Star },
      { title: "Workflow Requests", href: "/dashboard/workflow-requests", icon: FileText },
      { title: "Workflow Approvals", href: "/dashboard/workflow-approvals", icon: CheckSquare },
      { title: "Bookings", href: "/dashboard/bookings", icon: Ticket },
      { title: "Services", href: "/dashboard/services", icon: Wrench },
    ],
  },
  {
    title: "Manage",
    items: [
      { title: "Mentees", href: "/dashboard/mentees", icon: Users },
      { title: "Mentorship", href: "/dashboard/mentorship", icon: Heart },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", href: "/dashboard/profile", icon: User },
    ],
  },
];
