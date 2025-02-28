import { SiGmail } from "react-icons/si";
import { ROUTES } from "../../../routes/Routes";

export function Footer ()  {
  const email = "jacksoncheriyan05@gmail.com"; // Replace with your actual email
  const subject = "Inquiry from Website DoWhileLearn";
  const body = "Hello, I would like to ask about...";

  const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return (
        <div>
                  <footer className="bg-violet-950 text-white py-12 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-gray-400">
              We're dedicated to providing quality education through expert-led video courses.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href={ROUTES.common.Courses}>All Courses</a></li>
              <li>For Business</li>
              <li>Communities</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <div>


            <button
              onClick={() => window.open(mailtoLink, "_blank")}
              className=" transiton-all scale-110 text-accent px-4 py-2 rounded-lg transition"
            >
            <SiGmail />
            </button>
            </div>
            <p className="text-gray-400">
              Follow us on social media for updates and learning tips.
            </p>
          </div>
        </div>
      </footer>
        </div>
    )
}