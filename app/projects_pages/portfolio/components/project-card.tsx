"use client";

import * as React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/app/projects_pages/portfolio/components/ui/element/Card"

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

const ProjectCard = ({ title, description, technologies, link }: ProjectCardProps) => {
  return (
    <Card className="w-full h-auto bg-uni-slate-light text-white shadow-lg border-none p-0 transition-all duration-300 hover:scale-105 cursor-pointer"
         onClick={() => window.open(link, '_blank')}>
      <CardHeader>
        <CardTitle className="text-xl text-light font-bold">{title}</CardTitle>
        <CardDescription className="text-sm text-light">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs">
              {tech}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;