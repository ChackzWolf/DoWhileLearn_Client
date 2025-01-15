export function Footer ()  {
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
              <li>All Courses</li>
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
            <p className="text-gray-400">
              Follow us on social media for updates and learning tips.
            </p>
          </div>
        </div>
      </footer>
        </div>
    )
}