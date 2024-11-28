import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { BsStarHalf } from "react-icons/bs";
import userAxios from "../../../utils/axios/userAxios.config";
import { userEndpoint } from "../../../constraints/userEndpoints";
import { getCookie } from "../../../utils/cookieManager";
import axios from "axios";
import Spinner from "../../common/icons/Spinner";

interface Reviews {
  id: string;
  profilePic: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  helpful: any;
}

const StudentReviews: React.FC<{
  courseId: string | undefined;
  isPurchased: boolean;
  averageRating: number | undefined;
  totalRatings:number| undefined
}> = ({ courseId, isPurchased ,averageRating ,totalRatings }) => {
  // ... previous state declarations remain the same ...

  // Add new state for reviews
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [isUploadingReview, setIsUploadingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isReviewed, setIsReviewed] = useState(true);
  const userId = getCookie("userId");

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewData = await axios.get(userEndpoint.fetchReviewsOfCourse, {
        params: { courseId },
      });
      console.log(
        reviewData.data,
        "///////////////////////////////////////////////////"
      );
      setReviews(reviewData.data.reviewData);
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const setupReview = () => {
      const userExists = reviews.some(
        (review: any) => review.userId === userId
      );
      if (userExists && reviews) {
        console.log("userExists");

        const review = reviews.find((review: any) => review.userId === userId);

        if (review) {
          // Check if review is not undefined
          const filteredUsers = reviews.filter(
            (review: any) => review.userId !== userId
          ); // Should filter by !== to remove user's review
          setReviews(filteredUsers);
          setRating(review.rating);
          setComment(review.comment);
          setIsReviewed(userExists);
        }
      }
    };

    setupReview();
  }, [reviews]);

  // Handle star click to set rating
  const handleStarClick = (index: any) => setRating(index + 1);

  // Render stars based on the rating
  const renderStarsForRating = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        onClick={() => handleStarClick(index)}
        className={`cursor-pointer text-2xl ${
          index < rating ? "text-purple-600" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  // Handle submit
  const handleSubmit = async () => {
    setIsUploadingReview(true);
    if (rating && comment) {
      //   onSubmitReview({ rating, comment });
      const data = {
        userId: getCookie("userId"),
        courseId,
        rating,
        comment,
      };

      console.log("data", data);
      const response = await userAxios.post(userEndpoint.addUserReview, data);
      console.log(response);
      setIsReviewed(true);
      //   setRating(0);
      //   setComment("");
    } else {
      alert("Please provide a rating and comment.");
    }
    setIsUploadingReview(false);
  };

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-purple-600" />);
    }

    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half-star" className="text-purple-600 " />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-star-${i}`} className="text-gray-300" />);
    }

    return stars;
  };
  console.log(isPurchased);
  console.log(isReviewed, ":isReviewed");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br"
    >
      {reviews.length > 0  || isReviewed? (
        <div className="max-w-7xl mx-auto p-1">
          {/* Previous content remains the same until the end of the modules section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Main Content Column */}
            <div className="lg:col-span-2 ">
              {/* ... Previous content remains the same ... */}

              {/* Reviews Section */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white px-6"
              >
                <h2 className="text-2xl font-bold text-purple-600 mb-6">
                  Student Reviews
                </h2>
                {isPurchased && (
                  isReviewed === true ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-purple-50 rounded-xl p-6 mb-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-purple-600">
                          Your feedback
                        </h2>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center gap-1 my-2 px-3">
                          {renderStars(rating)}
                        </div>
                        {/* <div className="text-gray-600 text-sm">Tap stars to rate</div> */}
                      </div>
                      <div className="w-full bg-white border-gray-300 rounded-lg px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none">
                        {" "}
                        <h1>{comment}</h1>
                      </div>
                      <div className="w-full">
                        <button
                          onClick={() => {
                            setIsReviewed(false);
                          }}
                          className="mt-4 bg-white text-sm  text-purple-600 hover:underline font-semibold py-2 rounded-lg transition-all duration-300 text-right"
                        >
                          Edit Review
                        </button>
                      </div>
                    </motion.div>
                  ) : ( 
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-purple-50 rounded-xl p-6 mb-8 shadow-lg"
                    >{isReviewed}
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-purple-600">
                          Leave a Review
                        </h2>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center gap-1 my-2">
                          {renderStarsForRating()}
                        </div>
                        <div className="text-gray-600 text-sm">
                          Tap stars to rate
                        </div>
                      </div>
                      <textarea
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={4}
                        placeholder="Write your review here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        onClick={handleSubmit}
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
                      >
                        {isUploadingReview ? <Spinner /> : "Submit Review"}
                      </button>
                    </motion.div>
                  )
                ) }
                {/* Average Rating Card */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-purple-50 rounded-xl p-6 mb-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-1xl font-semibold text-purple-600">
                        {averageRating}
                      </div>
                      <div className="flex items-center gap-1 my-2">
                        {averageRating && renderStars(averageRating)}
                      </div>
                      <div className="text-gray-600 text-sm">Course Rating</div>
                    </div>
                    <div className="text-right">
                      <div className="text-1xl font-semibold text-gray-800">
                        {totalRatings}
                      </div>
                      <div className="text-gray-600 text-sm">
                        Total reviews
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.length > -1
                    ? reviews.map((review, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="border-b border-gray-100 last:border-0 pb-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              {review.profilePic ? (
                                <img
                                  src={review.profilePic}
                                  alt={review.name}
                                  className="w-12 h-12 rounded-full"
                                />
                              ) : (
                                <FaUserCircle className="w-12 h-12 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800">
                                  {review.name}
                                </h3>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 my-2">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-gray-600 mt-2">
                                {review.comment}
                              </p>
                              <div className="flex items-center gap-4 mt-4">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-2"
                                >
                                  <span>Helpful ({review.helpful})</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="text-sm text-gray-500 hover:text-gray-600"
                                >
                                  Report
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    : ""}
                </div>

                {/* Load More Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors font-medium"
                >
                  Load More Reviews
                </motion.button>
              </motion.section>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center flex-col">
          {isPurchased ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-purple-50 w-full rounded-xl p-6 mb-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-purple-600">
                  Be the first to Review
                </h2>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-1 my-2">
                  {renderStarsForRating()}
                </div>
                <div className="text-gray-600 text-sm">Tap stars to rate</div>
              </div>
              <textarea
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
              >
                {isUploadingReview ? <Spinner /> : "Submit Review"}{" "}
              </button>
            </motion.div>
          ) : (
            ""
          )}

          <h1 className="text-2xl font-bold text-gray-600  m-10">
            No reviews yet.
          </h1>
        </div>
      )}
      <ToastContainer />
    </motion.div>
  );
};

export default StudentReviews;
