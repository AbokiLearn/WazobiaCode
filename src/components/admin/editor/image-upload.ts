import { createImageUpload } from 'novel/plugins';
import { toast } from 'sonner';

const toastOpts = {
  action: {
    label: 'Close',
    onClick: () => {
      toast.dismiss();
    },
  },
  duration: 5000,
};

const onUpload = (file: File) => {
  const promise = fetch('/api/files/upload', {
    method: 'POST',
    headers: {
      'x-file-name': file?.name || 'image.png',
    },
    body: file,
  });

  return new Promise((resolve) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 201) {
          const { fileUrl } = (await res.json()) as any;
          // preload the image
          let image = new Image();
          image.src = fileUrl;
          image.onload = () => {
            resolve(fileUrl);
          };
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error(
            '`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.',
          );
          // Unknown error
        } else {
          throw new Error(`Error uploading image. Please try again.`);
        }
      }),
      {
        loading: 'Uploading image...',
        success: 'Image uploaded successfully.',
        error: (e) => e.message,
        ...toastOpts,
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes('image/')) {
      toast.error('File type not supported.', {
        ...toastOpts,
      });
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error('File size too big (max 20MB).', {
        ...toastOpts,
      });
      return false;
    }
    return true;
  },
});
