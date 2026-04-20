export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Unable to read file.'))
    }

    reader.onerror = () => {
      reject(new Error('Unable to read file.'))
    }

    reader.readAsDataURL(file)
  })
