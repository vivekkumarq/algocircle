export interface NavItem {
  label: string;
  route: string;
  /** Short description used by the sidebar tooltip and the command palette later. */
  hint?: string;
  exact?: boolean;
  badge?: string;
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  items: NavItem[];
}
