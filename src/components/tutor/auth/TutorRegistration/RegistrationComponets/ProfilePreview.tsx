import { useFormik } from 'formik';

const ProfilePictureUpload = () => {
  const formik = useFormik({
    initialValues: {
      profilePicture: "",
    },
    onSubmit: values => {
      console.log(values);
    },
  });

  const handleFileChange = (event:any) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("profilePicture", file ? URL.createObjectURL(file) : "");
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="file"
        name="profilePicture"
        onChange={handleFileChange}
      />
      <img src={formik.values.profilePicture} alt="Profile Preview" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProfilePictureUpload
