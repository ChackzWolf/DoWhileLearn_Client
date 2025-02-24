export const ProfileSkeleton = () => {
    return (
      <div className="min-h-screen md:py-8">
        <div className="max-w-7xl mx-auto bg-accent rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="p-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-11">
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-full bg-gray-300"></div>
  
              <div className="flex-1 w-full">
                <div className="flex justify-between flex-col md:flex-row items-center mb-4">
                  <div className="h-6 w-48 bg-gray-300 rounded"></div>
                  <div className="h-10 w-28 bg-gray-300 rounded"></div>
                </div>
                <div className="h-16 bg-gray-300 w-full rounded"></div>
              </div>
            </div>
  
            {/* Profile Content */}
            <div className="space-y-6">
              <div className="flex justify-between flex-col gap-6 md:flex-row">
                {/* Contact Information */}
                <div className="flex flex-col gap-11">
                  <div className="h-6 w-48 bg-gray-300 rounded"></div>
                  <div className="h-6 w-48 bg-gray-300 rounded"></div>
                </div>
  
                {/* Certifications Section */}
                <div className="w-full">
                  <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-300 rounded"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
  
              {/* Social Media Links */}
              <div className="flex flex-col my-8">
                <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                </div>
              </div>
  
              {/* Enrolled Courses */}
              <div className="mt-14">
                <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-300 rounded"></div>
                  <div className="h-24 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
