import axios from "axios";

const url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_APP_CLOUDINARY_CLOUDE_NAME
}/auto/upload`;


const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app-files");
  //    const res = await fetch(url,{
  //     method:"post",
  //     body:formData
  //    })
  //    const data = await res.json()
  //    return data
  try {
    const res = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = res?.data;
    return data;
  } catch (error) {
    console.log("Failed to upload avatar:", error);
  }
};

export default uploadFile;
