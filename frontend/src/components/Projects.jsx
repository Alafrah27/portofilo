import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { axiosInstance } from '../lib/Axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Add more detailed logging


        const res = await axiosInstance.get('/project/all');



        // Check if res.data exists and is an array
        if (Array.isArray(res.data)) {
          setProjects(res.data);
        } else {
          setProjects([]);
        }
      } catch (error) {


        setError(error.response?.data?.message || error.message || 'Failed to fetch projects');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
    </div>
  );

  // Error Component
  const ErrorDisplay = () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error || 'Unable to load projects'}</p>
      </div>
    </div>
  );

  // Debugging Render Method
  const renderProjectsDebug = () => {


    // Check for empty projects
    if (projects.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-600">No projects found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => {

          return (
            <div
              key={project?._id || index}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Project Card Content */}


              <div className="relative overflow-hidden h-64">
                <img
                  src={project?.image}
                  alt={project?.title}
                  loading='lazy'
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-bold text-xl">{project?.title}</h3>
                    <span className="text-sm uppercase tracking-wider">mern stack web</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">
                  {project?.title || 'Untitled Project'}
                </h3>
                <p className="text-gray-600">
                  {project?.description || 'No description available'}
                </p>
                {project?.url && (
                  <Link
                    to={project.url}
                    className="mt-4 inline-block text-primary-500 hover:text-primary-700"
                  >
                    View Project
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Main Render
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;

  return (
    <section id='projects' className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">My Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A showcase of my recent work and creative solutions.
          </p>
        </div>

        {renderProjectsDebug()}
      </div>
    </section>
  );
}

export default Projects;