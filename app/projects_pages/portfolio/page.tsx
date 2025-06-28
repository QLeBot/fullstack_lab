'use client';

import React from 'react';
import CardWithForm from '@/app/projects_pages/portfolio/components/project-card';
//import { GeistSans } from 'geist/font/sans';
//import { Github, Linkedin, Mail } from "lucide-react";
import ProjectCard from '@/app/projects_pages/portfolio/components/project-card';
import ViewSwitcher from '@/app/projects_pages/portfolio/components/view-switcher';
import { Linkedin, Github, Mail } from "lucide-react";
import { 
  FaPython, FaDatabase, FaAws, FaMicrosoft, 
  FaReact, FaHtml5, FaCss3, FaJava, FaSwift, 
  FaAndroid 
} from 'react-icons/fa';
import { 
  SiPython, SiPandas, SiNumpy, SiKeras, SiScikitlearn, SiTensorflow, SiPytorch, 
  SiMongodb, SiPostgresql, SiMysql, SiOracle, SiApachespark, SiScala, SiDatabricks, SiApachekafka, SiDbt, SiApacheairflow,
  SiQlik,
  SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss, 
  SiKotlin, SiSwift
} from 'react-icons/si';
import BlurText from "@/app/projects_pages/portfolio/components/ui/text/BlurText";
import SplitText from "@/app/projects_pages/portfolio/components/ui/text/SplitText";
import GradientText from "@/app/projects_pages/portfolio/components/ui/text/GradientText";
import DecryptedText from '@/app/projects_pages/portfolio/components/ui/text/DecryptedText';
import ScrollReveal from '@/app/projects_pages/portfolio/components/ui/text/ScrollReveal';
import ScrollFloat from '@/app/projects_pages/portfolio/components/ui/text/ScrollFloat';
import VariableProximity from '@/app/projects_pages/portfolio/components/ui/text/VariableProximity';

import ColorThief from 'colorthief';
import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import PageNavigator from "@/app/components/PageNavigator";

const Portfolio = () => {
  const containerRef = useRef(null);
  
  return (
    <div className="w-full flex flex-col min-h-screen bg-gradient-darker space-mono-regular">
      <PageNavigator />

      {/* Spacing */}
      <div className="h-20"></div>

      <div className="flex flex-col items-center justify-center">

        <BlurText 
          text="Just a text to test the blur text component" 
          className="text-2xl text-stone-200 font-bold space-mono-bold"
          delay={100}
        />

        <GradientText 
          className="text-2xl font-bold space-mono-bold"
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={10}
          showBorder={false}
        >
          Just a text to test the gradient text component
        </GradientText>

        <DecryptedText 
          text="Just a text to test the decrypted text component" 
          speed={50}
          maxIterations={20}
          characters="ABCD1234!?"
          className="revealed text-2xl text-stone-200 font-bold space-mono-bold"
          parentClassName="all-letters"
          encryptedClassName="encrypted text-2xl text-stone-200 font-bold space-mono-bold"
          revealDirection="start"
          animateOn="view"
          useOriginalCharsOnly={false}
          sequential={true}
        />

        <div ref={containerRef} style={{position: 'relative'}}>
          <VariableProximity
            label={'Just a text to test the variable proximity component'}
            className={'variable-proximity-demo'}
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={100}
            falloff='linear'
          />
        </div>

        {/*
        <ScrollReveal
          baseOpacity={0.1}
          enableBlur={true}
          baseRotation={3}
          blurStrength={4}
        >
          When does a man die? When he is hit by a bullet? No! When he suffers a disease?
        </ScrollReveal>

        <ScrollFloat
          animationDuration={1}
          ease='back.inOut(2)'
          scrollStart='center bottom+=50%'
          scrollEnd='bottom bottom-=40%'
          stagger={0.03}
        >
          Just a text to test the scroll float component
        </ScrollFloat>
        */}
  
      </div>
      
      {/* Hero Section */}
      <section className="flex-grow mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 pt-40 container">
        <h1 className="mb-4 py-8 pt-4 text-7xl text-stone-200 font-bold space-mono-bold">
          Quentin Lecomte
        </h1>
        <p className="text-xl mb-4 text-stone-200">Data Engineer</p>
        <p className="text-lg mb-8 text-stone-200 max-w-2xl">
          Engineering graduate specialized in Artificial Intelligence, with expertise in Data Science, 
          Data Engineering, Cloud and DevOps. Based in France, with professional experience in Switzerland.
        </p>
        
        {/* Social Links */}
        <div className="flex gap-6 mb-12">
          <a href="https://www.linkedin.com/in/lecomte-quentin/" className="text-light flex items-center gap-2 hover:text-dark">
            <Linkedin className="w-6 h-6" />
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/QLeBot" className="text-light flex items-center gap-2 hover:text-dark">
            <Github className="w-6 h-6" />
            <span>GitHub</span>
          </a>
          <a href="mailto:lecomteq.ql@gmail.com" className="text-light flex items-center gap-2 hover:text-dark">
            <Mail className="w-6 h-6" />
            <span>Email</span>
          </a>
        </div>
      </section>

      {/* Skills Section */}
      <section className="w-full py-16">
        <div className="mx-auto w-[95%] lg:w-[90%] xl:w-[85%] px-4">
          <h2 className="text-3xl text-light font-bold mb-8">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Data Science & AI */}
            <div className="bg-uni-slate-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-light font-bold mb-3">Data Science & AI</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center">
                  <SiPython className="w-8 h-8 text-blue-500" />
                  <span className="text-sm mt-1">Python</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiPandas className="w-8 h-8 text-blue-800" />
                  <span className="text-sm mt-1">Pandas</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiNumpy className="w-8 h-8 text-blue-600" />
                  <span className="text-sm mt-1">Numpy</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiScikitlearn className="w-8 h-8 text-orange-500" />
                  <span className="text-sm mt-1">Scikit-Learn</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiKeras className="w-8 h-8 text-red-500" />
                  <span className="text-sm mt-1">Keras</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiTensorflow className="w-8 h-8 text-orange-500" />
                  <span className="text-sm mt-1">TensorFlow</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiPytorch className="w-8 h-8 text-red-500" />
                  <span className="text-sm mt-1">PyTorch</span>
                </div>
              </div>
            </div>

            {/* Data Engineering */}
            <div className="bg-uni-slate-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-light font-bold mb-3">Data Engineering</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center">
                  <FaDatabase className="w-8 h-8 text-gray-600" />
                  <span className="text-sm mt-1">SQL</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiMongodb className="w-8 h-8 text-green-500" />
                  <span className="text-sm mt-1">MongoDB</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiPostgresql className="w-8 h-8 text-blue-400" />
                  <span className="text-sm mt-1">PostgreSQL</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiMysql className="w-8 h-8 text-blue-600" />
                  <span className="text-sm mt-1">MySQL</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiOracle className="w-8 h-8 text-red-600" />
                  <span className="text-sm mt-1">Oracle</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiApachespark className="w-8 h-8 text-orange-600" />
                  <span className="text-sm mt-1">PySpark</span>
                </div>
              </div>
            </div>

            {/* Cloud */}
            <div className="bg-uni-slate-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-light font-bold mb-3">Cloud</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <FaMicrosoft className="w-8 h-8 text-blue-500" />
                    <span className="text-sm">Azure</span>
                  </div>
                  <span className="text-xs mt-1 ml-10">Data Factory, Azure SQL Database, Blob Storage</span>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <FaAws className="w-8 h-8 text-orange-500" />
                    <span className="text-sm">AWS</span>
                  </div>
                  <span className="text-xs mt-1 ml-10">S3 Bucket, Lambda</span>
                </div>
              </div>
            </div>

            {/* Data Analysis & Visualization */}
            <div className="bg-uni-slate-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-light font-bold mb-3">Data Analysis & Visualization</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center">
                  {/*<SiPowerbi className="w-8 h-8 text-yellow-500" />*/}
                  <span className="text-sm mt-1">PowerBI</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiQlik className="w-8 h-8 text-green-500" />
                  <span className="text-sm mt-1">QlikSense</span>
                </div>
              </div>
            </div>

            {/* Web Development */}
            {/*
            <div className="bg-uni-slate-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-light font-bold mb-3">Web Development</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center">
                  <FaHtml5 className="w-8 h-8 text-orange-600" />
                  <span className="text-sm mt-1">HTML5</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaCss3 className="w-8 h-8 text-blue-600" />
                  <span className="text-sm mt-1">CSS3</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiJavascript className="w-8 h-8 text-yellow-400" />
                  <span className="text-sm mt-1">JavaScript</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiTypescript className="w-8 h-8 text-blue-600" />
                  <span className="text-sm mt-1">TypeScript</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaReact className="w-8 h-8 text-blue-400" />
                  <span className="text-sm mt-1">React</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiNextdotjs className="w-8 h-8 text-black" />
                  <span className="text-sm mt-1">Next.js</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiTailwindcss className="w-8 h-8 text-cyan-400" />
                  <span className="text-sm mt-1">Tailwind</span>
                </div>
              </div>
            </div>
            */}

            {/* Mobile Development */}
            {/*
            <div className="bg-uni-slate-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-light font-bold mb-3">Mobile Development</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center">
                  <FaSwift className="w-8 h-8 text-orange-500" />
                  <span className="text-sm mt-1">Swift</span>
                </div>
                <div className="flex flex-col items-center">
                  <SiKotlin className="w-8 h-8 text-purple-600" />
                  <span className="text-sm mt-1">Kotlin</span>
                </div>
              </div>
            </div>
            */}
          </div>
        </div>
      </section>

      <ViewSwitcher />

      {/* Projects Section */}
      <section className="w-full py-16">
        <div className="mx-auto w-[95%] lg:w-[90%] xl:w-[85%] px-4">
          <h2 className="text-3xl text-light font-bold mb-8">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard title="AI Platform" description="Creating a centralized platform for AI models using pay-as-you-go API and running local models" technologies={["Typescript", "Next.js", "React", "Tailwind", "Python", "MongoDB"]} link="/projects/ai-platform" />
            <ProjectCard title="Synthetic Dataset" description="Exploring a mix of techniques to create a synthetic dataset from real data using Data Science, LLM Generative AI and Scraping" technologies={["Python", "Selenium", "Pandas", "OpenAI API"]} link="/projects/dataset" />
            {/* 
            <ProjectCard title="Football Data Analysis" description="Scraping data from websites and creating a end-to-end data infrastructure with pipelines, queues and dashboards." technologies={["Python", "Selenium", "SQL", "Databricks", "Kafka", "PowerBI"]} link="https://example.com" />
            <ProjectCard title="Project 4" description="Description 4" technologies={["Python", "Pandas", "SQL"]} link="https://example.com" />
            */}
          </div>
        </div>
      </section>

      {/*<Footer />*/}
    </div>
  );
};

export default Portfolio;