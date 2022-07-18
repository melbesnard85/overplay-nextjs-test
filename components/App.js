import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import Card from 'react-bootstrap/Card'
import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
// import './styles.css'

function App() {
  const [compressedLink, setcompressedLink] = useState(
    'http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png'
  )
  const [originalImage, setoriginalImage] = useState('')
  const [originalLink, setoriginalLink] = useState('')
  const [outputFileName, setoutputFileName] = useState('')

  const [clicked, setclicked] = useState(false)
  const [uploadImage, setuploadImage] = useState(false)

  const handle = (e) => {
    const imageFile = e.target.files[0]
    setoriginalLink(URL.createObjectURL(imageFile))
    setoriginalImage(imageFile)
    setoutputFileName(imageFile.name)
    setuploadImage(true)
  }

  //   const changeValue = e => {
  //     this.setState({ [e.target.name]: e.target.value });
  //   };

  const click = (e) => {
    e.preventDefault()

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    }

    if (options.maxSizeMB >= originalImage.size / 1024) {
      alert("Image is too small, can't be Compressed!")
      return 0
    }

    let output
    imageCompression(originalImage, options).then((x) => {
      output = x
      const downloadLink = URL.createObjectURL(output)

      setcompressedLink(downloadLink)
      //upload to s3 bucket
      addPhoto(output)
    })

    setclicked(true)

    return 1
  }

  const addPhoto = (file) => {
    const fileName = file.name
    const albumPhotosKey = encodeURIComponent(albumName) + '/'

    const photoKey = albumPhotosKey + fileName

    // Use S3 ManagedUpload class as it supports multipart uploads
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file,
      },
    })

    const promise = upload.promise()

    promise.then(
      function (data) {
        alert('Successfully uploaded photo.')
        viewAlbum(albumName)
      },
      function (err) {
        return alert('There was an error uploading your photo: ', err.message)
      }
    )
  }

  return (
    <div className='m-5'>
      <div className='text-light text-center'>
        <h1>Three Simple Steps</h1>
        <h3>1. Upload Image</h3>
        <h3>2. Click on Compress</h3>
        <h3>3. Download Compressed Image</h3>
      </div>

      <div className='row mt-5'>
        <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12'>
          {uploadImage ? (
            <Card.Img
              className='ht'
              variant='top'
              src={originalLink}
            ></Card.Img>
          ) : (
            <Card.Img
              className='ht'
              variant='top'
              src='http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png'
            ></Card.Img>
          )}
          <div className='d-flex justify-content-center'>
            <input
              type='file'
              accept='image/*'
              className='mt-2 btn btn-dark w-75'
              onChange={(e) => handle(e)}
            />
          </div>
        </div>
        <div className='col-xl-4 col-lg-4 col-md-12 mb-5 mt-5 col-sm-12 d-flex justify-content-center align-items-baseline'>
          <br />
          {outputFileName ? (
            <button
              // type="button"
              className=' btn btn-dark'
              onClick={(e) => click(e)}
            >
              Compress
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3'>
          <Card.Img variant='top' src={compressedLink}></Card.Img>
          {clicked ? (
            <div className='d-flex justify-content-center'>
              <a
                href={compressedLink}
                download={outputFileName}
                className='mt-2 btn btn-dark w-75'
              >
                Download
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
