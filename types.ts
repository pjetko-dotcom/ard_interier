export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface RealizationItem {
  id: number;
  image: string;
  title: string;
  category: string;
  categoryKey: 'residential' | 'commercial'; // Added for filtering
  location?: string;
}

export interface ReferenceItem {
  id: number;
  name: string;
  text: string;
  projectType: string;
}

export interface NavigationItem {
  name: string;
  href: string;
}