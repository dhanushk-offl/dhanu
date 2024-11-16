import { Icons } from "@/components/icons";
import { log } from "console";
import { HomeIcon, icons, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Dhanush Kandhan",
  initials: "K",
  url: "https://itsdhanu.me",
  location: "Bengaluru, Karnataka",
  locationLink: "https://www.google.com/maps/place/bengaluru",
  description:
    "AI Engineer, Researcher, Technologist, Writer, Technologist & Community Enthusiast ⚡🌿",
  summary:
    "Hey there! 👋 I'm a Developer Technology Intern at Nvidia, passionate about innovation, and an AI and Computer Ethics Research Fellow at Cambridge University, exploring the ethical dimensions of technology. With experience at Google and now mentoring at Naan Mudhalvan through the Government of Tamil Nadu, India, I also serve as the Technical Regional Leader for UN Youth Volunteers in India, driving impactful change in tech. As the Podcast Host of Idunammatechu, I blend expertise and passion to amplify voices and ideas. With degrees in IT from Anna University and Data Science from MITx, I'm always ready for new adventures, whether it's tech, food, cars, or travel. 🍵💻",
  avatarUrl: "/me.jpg",
  skills: [
    "Python",
    "JavaScript",
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Kotlin",
    "Svelte",
    "Docker",
    "PHP",
    "Figma",
    "Google Cloud",
    "Git",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "https://itzmedhanu.medium.com/", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "dhanushkandhan75@gmail.com",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/dhanushk-offl",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/dhanushkandhan/",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/itzmedhanu",
        icon: Icons.x,

        navbar: true,
      },
      Youtube: {
        name: "Youtube",
        url: "https://youtube.com/@dhanushk05",
        icon: Icons.youtube,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:dhanushkandhan75@gmail.com",
        icon: Icons.email,

        navbar: true,
      },
    },
  },

  work: [
    {
      company: "University of Cambridge",
      href: "https://www.cam.ac.uk/",
      badges: [],
      location: "Remote",
      title: "Research Fellow - AI & Computer Ethics",
      logoUrl: "/cam_univ.png",
      start: "Oct 2023",
      end: "Present",
      description:
        "Developed and authored a research paper on Artificial Intelligence for Image Processing utilizing Advanced Image Pixel Matrices.  Working in Cambridge University’s Intel Lab for development of secured AI Models against deep fakes images and videos generation as an AI Researcher",
    },
    {
      company: "Talentship",
      badges: [],
      href: "https://talentship.io/",
      location: "Chennai, India",
      title: "Software Engineer Intern",
      logoUrl: "/talentship.jpeg",
      start: "Aug 2024",
      end: "Present",
      description:
        "Working With Front-ends Projects using React Framework for Smart Company Goals Management System. Designing the aspect applications to ensure the proper acquirements of web apps!",
    },
    {
      company: "Nvidia",
      href: "https://nvidia.com/",
      badges: [],
      location: "Bengaluru, India",
      title: "Developer Technology Intern",
      logoUrl: "/nvidia.png",
      start: "May 2024",
      end: "July 2024",
      description:
        "I successfully developed and implemented deep learning-based AI algorithms (CNNs, RNNs) for image and frame prediction in game optimization. By reducing GPU workload and improving frame rates, I significantly enhanced game performance. Additionally, I collaborated with cross-functional teams to integrate AI solutions into existing game frameworks and optimize them for Nvidia's hardware. As a Developer Technology Intern at Nvidia, I contributed to the development of AI-driven game optimization tools by analyzing complex AI models and utilizing programming languages, machine learning frameworks, and Nvidia's proprietary tools.",
    },
    {
      company: "Google",
      href: "https://google.com/about",
      badges: [],
      location: "Bengaluru, India",
      title: "Software Engineer Intern",
      logoUrl: "/Google.png",
      start: "Aug. 2023",
      end: "Jan. 2024",
      description:
        "I leveraged Google's AI-powered IDE, Project IDX, to fine-tune diffusion models and develop a custom dataset with AI algorithms for rapid application development and deployment. (This focuses on the tools and your accomplishments).  In addition to working with Project IDX, I fine-tuned diffusion models like Stable Diffusion for image generation and built a custom dataset with AI algorithms to streamline application development. I'm excited to continue exploring new research avenues! (This emphasizes your specific AI work and future plans)",
    },
    {
      company: "Data Scientist Intern",
      href: "https://yellow.ai/",
      badges: [],
      location: "Remote",
      title: "Data Scientist Intern",
      logoUrl: "/yellow_ai.png",
      start: "Dec. 2022",
      end: "May 2023",
      description:
        "I worked on enhancing CRM chat box assistance by utilizing comprehensive datasets for individual clients. I also successfully resolved a critical software infrastructure issue within the backend Web Server software.",
    },
  ],
  education: [
    {
      school: "Anna University, Chennai",
      href: "https://www.annauniv.edu/",
      degree: "Bachelor's Degree of Information Technology (B.Tech IT)",
      logoUrl: "/anna_univ.png",
      start: "2022",
      end: "2026",
    },
    {
      school: "Massachusetts Institute of Technology, USA",
      href: "https://micromasters.mit.edu/",
      degree: "MicroMasters (Statistics & Data Science)",
      logoUrl: "/mit_logo.png",
      start: "2023",
      end: "2025",
    },
  ],
  projects: [
    {
      title: "Revibe 2024 Website",
      href: "https://revibe.in.net",
      dates: "April 2024",
      active: true,
      description:
        "Created a Complete Event Management web applications links named Revibe Event for a College Event with efficient web client and server optimization using several frameworks packages",
      technologies: [
        "Svelte",
        "Typescript",
        "MySQL",
        "PHP",
        "TailwindCSS",
        "Vite",
        "Github Actions",
        "Vercel",
        "Vercel Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://revibe.in.net/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Github",
          href: "https://github.com/dhanushk-offl/revibe-event",
          icon: <Icons.github className="size-3" />
        }
      ],
      image: "/revibe_proj.png",
      video:
        "",
    },
    {
      title: "Dhanush's Portfolio",
      href: "https://itsdhanu.me",
      dates: "October 2024",
      active: true,
      description:
        "Designed and Developed a responsive portfolio using Next.Js framework, for fast and reliable performance and well experienced UI",
      technologies: [
        "Next.js",
        "React.js",
        "Typescript",
        "TailwindCSS",
        "Github Actions",
        "Cloudflare",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://itsdhanu.me/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Github",
          href: "https://github.com/dhanushk-offl/dhanu",
          icon: <Icons.github className="size-3" />
        }
      ],
      image: "/portfolio.png",
      video:
        "",
    },
    {
      title: "Dhanush's Portfolio",
      href: "https://dhanush.pages.dev",
      dates: "July 2024",
      active: true,
      description:
        "Designed and Developed a responsive portfolio using sveltekit framework, for fast and reliable performance and well experienced UI",
      technologies: [
        "Svelte",
        "Typescript",
        "TailwindCSS",
        "Vite",
        "Github Actions",
        "Cloudflare",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://dhanush.pages.dev/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Github",
          href: "https://github.com/dhanushk-offl/dhanush",
          icon: <Icons.github className="size-3" />
        }
      ],
      image: "/portfolio2.png",
      video:
        "",
    },
    {
      title: "AI Resume Analyzer",
      href: "https://github.com/dhanushk-offl/resume-analyzer",
      dates: "June 2024",
      active: true,
      description:
        "Engineer an AI-powered resume scoring application incorporating the Llama 3 AI model. The application will analyze resumes against predefined skill sets and job descriptions, generating a numerical score indicative of overall suitability.",
      technologies: [
        "Python",
        "Streamlit",
        "Groq",
        "Meta AI",
        "Github Actions",
      ],
      links: [
        {
          type: "Github",
          href: "https://github.com/dhanushk-offl/resume-analyzer",
          icon: <Icons.github className="size-3" />
        }
      ],
      image: "/ai-resume-proj.png",
      video:
        "",
    },
  ],
community: [
  {
    name: "Google Developer Groups Chennai",
    role: "Core Team Member",
    image: "/gdgchn.png",
    href: "https://gdg.community.dev/gdg-chennai/",
    dates: "July 2023 - Present",
  },
  {
    name: "Chennai React",
    role: "Organizer",
    image: "/chennaireact.png",
    href: "https://bento.me/chennaireact",
    dates: "April 2024 - Present",
  },
  {
    name: "ChennaiPy",
    role: "Community Volunteer",
    image: "/chennaipy.png",
    href: "https://chennaipy.org",
    dates: "September 2024 - Present",
  }
]
} as const;
