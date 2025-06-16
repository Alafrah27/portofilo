
import { useMemo } from 'react'
import { DevelopmentSkills, OtherSkills } from '../Services/data'


const SkillTools = () => {

    const DevTools = useMemo(() => {
        return DevelopmentSkills
    }, [])

    const OtherTools = useMemo(() => {
        return OtherSkills
    }, [])




    return (
        <section id="skills" className="py-20 bg-white section-padding">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-on-scroll">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900">— KEY PROGRAMS —</h2>
                    <p className="text-secondary-700 max-w-2xl mx-auto">
                        My professional toolkit includes industry-standard software and frameworks that empower me to bring concepts to life with precision and creativity.
                    </p>
                </div>



                <div className="mb-12 animate-on-scroll">
                    <h3 className="text-xl font-semibold mb-6 text-secondary-900">Development</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {DevTools?.map((skill, index) => (
                            <div key={index} className="skill-card group">
                                <div className="flex flex-col items-center">
                                    <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                        {skill.icon}
                                    </div>
                                    <h4 className="font-medium text-secondary-900">{skill.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="animate-on-scroll">
                    <h3 className="text-xl font-semibold mb-6 text-secondary-900">Other Tools</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {OtherTools?.map((skill, index) => (
                            <div key={index} className="skill-card group">
                                <div className="flex flex-col items-center">
                                    <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                        {skill.icon}
                                    </div>
                                    <h4 className="font-medium text-secondary-900">{skill.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SkillTools