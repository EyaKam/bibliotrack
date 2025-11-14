"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import config from '@/lib/config';
import { toast } from 'sonner';
const { env: { imageKit: { publicKey, urlEndpoint } } } = config;
const authenticator= async()=>{
  try{
    const response= await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if(!response.ok){
      const errortext= await response.text();
      throw new Error(`request failed with status ${response.status}: ${errortext}`);
    }
    const data= await response.json();
    const {signature,expire,token}= data;
    return {signature,expire,token};
  }catch(error : any){
    throw new Error(`authentication request failed: ${error}`);
  }
};
const ImageUpload = ( {onFileChange}: {onFileChange: (filePath: string) => void} ) => {
  const ikUploadRef = useRef(null);
  const [file, setFile]=useState<{filePath : string}|null>(null);
  const onerror = (error: any) => {
    console.log(error);
     toast( "Image Upload failed" ,{
       description: "your image could not be uploaded"
    },)
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast( "Image Uploaded" ,{
       description: `${res.filePath} uploaded successfully`
    },)
  };


  return ( 
  <ImageKitProvider 
   publicKey={publicKey}
   urlEndpoint={urlEndpoint} 
   authenticator={authenticator}
   >
    <IKUpload
      className="hidden" ref={ikUploadRef} onError={onerror} onSuccess={onSuccess}
      fileName="test-upload.png"/>
      <button className="upload-btn" onClick={(e)=> {
        e.preventDefault(); 
        if (ikUploadRef.current) { 
          // @ts-ignore
          (ikUploadRef.current ?.click() );
        }
        }}>
        <Image src="icons/upload.svg" alt="upload" width={20} height={20}/>
    
        <p className="text-base text-light-100">Upload a file</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>
      {file && (<IKImage 
        alt={file.filePath} 
        path={file.filePath}  
        width={500} 
        height={300} >
      </IKImage>

      )}
  </ImageKitProvider>
  );
};
export default ImageUpload;
