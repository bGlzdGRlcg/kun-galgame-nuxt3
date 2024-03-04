export const checkImageValid = (file: File) => {
  if (file.type === 'image/jpeg' || file.type === 'image/png') {
    return true
  } else {
    useMessage(
      'Invalid file type. Please select a JPEG or PNG image.',
      '非法的文件类型，请选择 JPG 或 PNG 图片！',
      'warn'
    )
    return false
  }
}

export const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      const maxWidth = 233
      const maxHeight = 233
      let newWidth = image.width
      let newHeight = image.height

      if (image.width > maxWidth || image.height > maxHeight) {
        const aspectRatio = image.width / image.height
        if (aspectRatio > 1) {
          newWidth = maxWidth
          newHeight = newWidth / aspectRatio
        } else {
          newHeight = maxHeight
          newWidth = newHeight * aspectRatio
        }
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = newWidth
      canvas.height = newHeight

      ctx?.drawImage(image, 0, 0, newWidth, newHeight)
      const resizedFile = dataURItoBlob(canvas.toDataURL('image/webp', 0.77))

      if (resizedFile.size > 1007 * 1024) {
        useMessage(
          'Image is too large. Please select an image smaller than 1007KB!',
          '文件过大，请选择小于 1007KB 的文件！',
          'warn'
        )
        reject(new Error('Image is too large.'))
      } else {
        resolve(resizedFile)
      }
    }
  })
}
