

import {
  FaHtml5, FaCss3Alt, FaJs, FaReact,
  FaNode,
} from 'react-icons/fa'
import {

  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiReactquery,
  SiBootstrap,
  SiReactrouter,
  SiShadcnui,
  SiVite
} from 'react-icons/si'

export const DevelopmentSkills = [
  { name: "HTML5", icon: <FaHtml5 size={32} className="text-orange-600" /> },
  { name: "CSS3", icon: <FaCss3Alt size={32} className="text-blue-500" /> },
  { name: "JavaScript", icon: <FaJs size={32} className="text-yellow-500" /> },
  { name: "React", icon: <FaReact size={32} className="text-blue-400" /> },
  { name: "Node.js", icon: <FaNode size={32} className="text-green-600" /> },
  {
    name: "Express.js",
    icon: <SiExpress size={32} className="text-green-900" />,
  },
  {
    name: "MongoDB",
    icon: <SiMongodb size={32} className="text-yellow-900" />,
  },
];

export const OtherSkills = [
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss size={32} className="text-purple-500" />,
  },
  {
    name: "@Transtack/query",
    icon: <SiReactquery size={32} className="text-red-500" />,
  },
  {
    name: "Bootstrap",
    icon: <SiBootstrap size={32} className="text-blue-700" />,
  },
  {
    name: "React Router",
    icon: <SiReactrouter size={32} className="text-green-600" />,
  },
  {
    name: "Shadcn/ui",
    icon: <SiShadcnui size={32} className="text-green-900" />,
  },
  { name: "Vite", icon: <SiVite size={32} className="text-yellow-900" /> },
];

export const AllProjects = [
  {
    id: 1,
    title: "E-commerce Redesign",
    category: "web",
    image:
      "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Complete redesign of an e-commerce platform with improved UX and conversion rate optimization.",
  },
  {
    id: 2,
    title: "Mobile Banking App",
    category: "mobile",
    image:
      "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "User-friendly banking application with advanced security features and seamless transaction flow.",
  },
  {
    id: 3,
    title: "Corporate Brand Identity",
    category: "branding",
    image:
      "https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Complete brand identity including logo, color palette, typography and brand guidelines.",
  },
  {
    id: 4,
    title: "Educational Platform",
    category: "web",
    image:
      "https://images.pexels.com/photos/5428258/pexels-photo-5428258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Interactive learning platform with gamification elements for enhanced student engagement.",
  },
  {
    id: 5,
    title: "Restaurant Menu App",
    category: "mobile",
    image:
      "https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Digital menu application with ordering functionality and real-time kitchen synchronization.",
  },
  {
    id: 6,
    title: "Fashion Lookbook",
    category: "branding",
    image:
      "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Seasonal fashion catalog designed for both print and digital platforms with cohesive visual language.",
  },
];