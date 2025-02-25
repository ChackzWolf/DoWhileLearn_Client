import { FaGraduationCap, FaExternalLinkAlt } from "react-icons/fa";
import { PiCertificateThin } from "react-icons/pi";
import { ROUTES } from "../../../../routes/Routes";
import { TiLocationArrow } from "react-icons/ti";

const Certifications = ({ certifications }: { certifications: { title: string; issueDate: string; certificateUrl: string }[] }) => {
  return (
    <div className="bg-accent rounded-xl  w-full md:w-1/2 ">
      <div>
        
      </div>
      <h2 className="text-sm mb-4 text-gray-500 flex items-center gap-2">
        <FaGraduationCap className="text-gray-400 text-2xl" />
        Certifications
      </h2>

      {certifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {certifications.slice(0,3).map((cert, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="flex gap-4 justify-center items-center">
                <PiCertificateThin className="text-4xl text-primary"/>

                <div>
                  <h3 className="text-lg font-medium text-gray-600">{cert.title}</h3>
                  <p className="text-sm text-gray-500">Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <a
                href={cert.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 flex items-center gap-2 transition-all hover:scale-105"
              >
                <FaExternalLinkAlt />
                View
              </a>
            </div>
          ))}
          {certifications.length > 2 && (
            <a href={ROUTES.user.certificates} className=" text-primary transition-all hover:underline flex gap-1 font-semibold  mx-2">See all <TiLocationArrow className="text-2xl"/>
</a>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No certifications yet.</p>
      )}
    </div>
  );
};

export default Certifications;
