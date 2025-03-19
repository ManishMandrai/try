import React, {useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'


const VideoUpload = () => {

  const [file, setFile] = useState<File | null> (null)
  const [title, setTitle ] =  useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter()

  const MAX_FILE_SIZE = 70 * 1024 * 1024

  const handleSubmit = async (e : React.FormEvent => {
    e.preventDefault()
    if(!file) return;

    if(file.size > MAX_FILE_SIZE){
      alert("file size too large")
      return; 
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try{
     const response =  await axios.post("/api/video-upload", formData)
    }catch(error){
      console.log(error)
    }
    finally{
      setIsUploading(false)
    }
  })

  return (
    <div>VideoUpload</div>
  )
}

export default VideoUpload;