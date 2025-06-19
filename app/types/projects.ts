export interface Project {
  id: number;
  name: string;
  description: string;
  route: string;
  category: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Hotel Landing",
    description: "A beautiful hotel landing page with modern design",
    route: "/projects_pages/hotel_landing",
    category: "Landing Pages"
  },
  {
    id: 2,
    name: "Gradient Generator",
    description: "Interactive gradient generator with custom controls",
    route: "/projects_pages/gradient_generator",
    category: "Tools"
  },
  {
    id: 3,
    name: "Color Palette",
    description: "Color palette generator from image uploads",
    route: "/projects_pages/color_palette",
    category: "Tools"
  },
  {
    id: 4,
    name: "Stock Analyzer",
    description: "Stock market analysis dashboard with filters",
    route: "/projects_pages/stock_analyzer",
    category: "Dashboards"
  },
  {
    id: 5,
    name: "Project 5",
    description: "A placeholder for future project",
    route: "/projects_pages/exhibit5",
    category: "Projects"
  },
  {
    id: 6,
    name: "Project 6",
    description: "A placeholder for future project",
    route: "/projects_pages/exhibit6",
    category: "Projects"
  },
  {
    id: 7,
    name: "New Project Example",
    description: "Demonstrates automatic navigation adaptation",
    route: "/projects_pages/new_project",
    category: "Examples"
  }
];

export const getProjectByRoute = (route: string): Project | undefined => {
  return projects.find(project => project.route === route);
};

export const getProjectById = (id: number): Project | undefined => {
  return projects.find(project => project.id === id);
};

// Utility functions for managing projects
export const getNextProjectId = (): number => {
  return Math.max(...projects.map(p => p.id)) + 1;
};

export const getProjectsByCategory = (category: string): Project[] => {
  return projects.filter(project => project.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(projects.map(project => project.category))];
};

export const getProjectCount = (): number => {
  return projects.length;
};

// Helper function to add a new project (for development)
export const addProject = (project: Omit<Project, 'id'>): Project => {
  const newProject: Project = {
    ...project,
    id: getNextProjectId()
  };
  
  // Note: In a real application, you'd want to persist this to a database
  // For now, this is just a helper for development
  console.log('New project to add:', newProject);
  return newProject;
}; 